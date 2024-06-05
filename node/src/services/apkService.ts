import Apk from '../models/Apk';
import fetchApkDetails from '../utils/fetchApkDetails';
import { RedisClientType } from 'redis';

/**
 * @name saveApkDetails
 * @description Fetches APK details and saves them to MongoDB, PostgreSQL, and Redis if they do not already exist.
 * @param {string} org - The organization of the APK.
 * @param {string} repo - The repository of the APK.
 * @returns {Promise<Array>} A promise that resolves to an array of APK details.
 */
async function saveApkDetails(redisClient: RedisClientType, org: string, repo: string) {
  try {
    const apkDetails = await fetchApkDetails(org, repo);

    for (const apk of apkDetails) {
      const { version, type, releaseDate } = apk;

      const existingApk = await Apk.findOne({ version, type, org, repo }).exec();
      if (existingApk) {
        console.log(`APK with version ${version} and type ${type} already exists. Skipping...`);
        continue;
      }


      // Yeni APK'yı MongoDB'ye ekle
      const newApk = new Apk({ ...apk });

      const savedApk = await newApk.save();

      const mongoId = savedApk._id;
      const lastProcessedDate = new Date();

      const pgClient = (global as any).pgClient;

      await pgClient.query(
        'INSERT INTO apk_miror.apk_distributions (version, type, mongo_id, last_processed_date) VALUES ($1, $2, $3, $4)',
        [version, type, mongoId, lastProcessedDate]
      );

      await redisClient.set(version, JSON.stringify({ lastProcessedDate }));
    }

    return apkDetails;
  } catch (error) {
    throw new Error(`Failed to save APK details`);
  }
}

export default saveApkDetails;
