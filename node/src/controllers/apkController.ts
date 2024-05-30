import { Request, Response } from 'express';
import Apk from '../models/Apk';
import { pgClient } from '../config/db';
import redisClient from '../config/redis';
import UserAgent from 'ua-parser-js';

/**
 * @name getAllVersions
 * @description Get all APK versions, sorted by release date in descending order.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function getAllVersions(req: Request, res: Response) {
  const versions = await Apk.find({}).sort({ releaseDate: -1 }).exec();
  res.json(versions);
}

/**
 * @name getVersionDetails
 * @description Get details of a specific version.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function getVersionDetails(req: Request, res: Response) {
  const version = await Apk.findById(req.params.id);
  res.json(version);
}

/**
 * @name deleteVersion
 * @description Delete a specific version by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function deleteVersion(req: Request, res: Response) {
  const apk = await Apk.findByIdAndDelete(req.params.id);

  if (!apk) {
    return res.sendStatus(404); // Eğer APK bulunamazsa 404 döner
  }

  const { version } = apk;

  // PostgreSQL'den sil
  await pgClient.query('DELETE FROM apk_miror.apk_distributions WHERE version = $1', [version]);

  // Redis'ten sil
  await redisClient.del(version);

  res.sendStatus(204);
}

/**
 * @name updateVersion
 * @description Update a specific version by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function updateVersion(req: Request, res: Response) {
  const updatedVersion = await Apk.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedVersion);
}

/**
 * @name checkAgent
 * @description Check if the user agent matches any APK version in the database and if the version is acceptable.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function checkAgent(req: Request, res: Response) {
  try {
    const { agent } = req.body;

    const userAgent = UserAgent(agent);

    const browserName = userAgent.browser.name;
    const browserVersion = userAgent.browser.version;

    if (!browserName || !browserVersion) {
      return res.status(400).json({ status: 'fail', message: 'Invalid user agent' });
    }

    // MongoDB'de org veya repo alanlarının browserName içerip içermediğini kontrol et
    const apk = await Apk.findOne({
      $or: [
        { org: { $regex: browserName, $options: 'i' } },
        { repo: { $regex: browserName, $options: 'i' } }
      ]
    });

    if (!apk) {
      return res.status(404).json({ status: 'fail', message: 'No matching APK found' });
    }

    function compareVersions(version1: string, version2: string): boolean {
      const v1Parts = version1.split('.').map(Number);
      const v2Parts = version2.split('.').map(Number);

      for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1 = v1Parts[i] || 0;
        const v2 = v2Parts[i] || 0;

        if (v1 < v2) return true;
        if (v1 > v2) return false;
      }

      return false;
    }

    const isVersionSmaller = compareVersions(browserVersion, apk.version);

    if (isVersionSmaller) {
      return res.status(400).json({ status: 'fail', message: 'Agent version is smaller than the required version' });
    }

    return res.status(200).json({ status: 'success', message: 'Matching APK found and version is acceptable', apk });
  } catch (error) {
    console.error('Error checking agent:', error);
    return res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

export {
  getAllVersions,
  getVersionDetails,
  deleteVersion,
  updateVersion,
  checkAgent,
};
