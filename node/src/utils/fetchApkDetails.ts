require('dotenv').config();
import { load } from 'cheerio';
import { Apk, Variant } from '../types';
import axios from 'axios';

/**
 * @name fetchApkDetails
 * @description Fetches APK details including versions and their variants for a given organization and repository.
 * @param {string} org - The organization of the APK.
 * @param {string} repo - The repository of the APK.
 * @returns {Promise<Apk[]>} A promise that resolves to an array of APK details.
 */
export async function fetchApkDetails(org: string, repo: string): Promise<Apk[]> {
  try {
    let versions = await getVersionsList(org, repo);

    for (const version of versions) {
      const variants = await getVariants(org, repo, version.version);

      version.variants = variants;
    }

    return versions;
  } catch (error) {
    console.error(`Failed to fetch APK details for ${org}/${repo}`, error);
    throw error;
  }
}

/**
 * @name getVersionsList
 * @description Fetches the list of versions for a given organization and repository from APKMirror.
 * @param {string} org - The organization of the APK.
 * @param {string} repo - The repository of the APK.
 * @returns {Promise<Apk[]>} A promise that resolves to an array of APK versions.
 */
export async function getVersionsList(org: string, repo: string): Promise<Apk[]> {
  try {
    const apkmUrl = `${process.env.SCRAPPING_URL}https://www.apkmirror.com/apk/${org}/${repo}`;
    
    const response = await axios.get(apkmUrl, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    const html = await response.data;
    const $ = load(html);

    const versions: Apk[] = $(
      `#primary > div.listWidget.p-relative > div > div.appRow`
    )
      .toArray()
      .flatMap((row, index) => {
        if (!row) {
          return [];
        }

        if (index > 10) {
          return [];
        }

        const versionElement = $(row).find('div:nth-child(2) > div > h5 > a').text().trim();
        const timeElement = new Date($(row).find('div:nth-child(3) > span > span').text().trim()).getTime();

        let type = 'stable';
        if (versionElement.includes('beta')) {
          type = 'beta';
        } else if (versionElement.includes('alpha')) {
          type = 'alpha';
        }

        const version = extractVersion(versionElement);

        if (!version) {
          return { version: versionElement, releaseDate: timeElement, type, org, repo, variants: [] as Variant[] };
        }

        return { version, releaseDate: timeElement, type, org, repo, variants: [] as Variant[] };
      })
      .filter((v) => v.version && v.releaseDate);

    return versions;
  } catch (error) {
    console.error(`Failed to fetch versions for ${org}/${repo}`, error);
    throw error;
  }
}

/**
 * @name getVariants
 * @description Fetches the list of variants for a specific version of an APK from APKMirror.
 * @param {string} org - The organization of the APK.
 * @param {string} repo - The repository of the APK.
 * @param {string} version - The version of the APK.
 * @returns {Promise<Variant[]>} A promise that resolves to an array of APK variants.
 */
export async function getVariants(org: string, repo: string, version: string) {
  const apkmUrl = `${process.env.SCRAPPING_URL}https://www.apkmirror.com/apk/${org}/${repo}/${repo}-${version.replace(
    ".",
    "-"
  )}-release`;

  const response = await axios.get(apkmUrl, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
  const html = await response.data;
  const $ = load(html);

  const rows = $(
    '.variants-table .table-row:has(span.apkm-badge:contains("APK")), .variants-table .table-row:has(span.apkm-badge:contains("BUNDLE"))'
  );

  const parsedData: Variant[] = [];

  rows.each((_index, row) => {
    const columns = $(row).find(".table-cell");

    const variant = $(columns[0]).text().trim().split(' ')[0].trim();
    const type = $(columns[0]).text().split(' ')[1].trim();
    
    const arch = $(columns[1]).text().trim();
    const version = $(columns[2]).text().trim();
    const dpi = $(columns[3]).text().trim();

    if (!variant || !arch || !version || !dpi) {
      return;
    }

    const rowData = {
      variant,
      type,
      arch,
      version,
      dpi,
    };

    parsedData.push(rowData);
  });
  return parsedData;
}

/**
 * @name extractVersion
 * @description Extracts the version number from a given string.
 * @param {string} input - The input string containing the version number.
 * @returns {string | undefined} The extracted version number or undefined if not found.
 */
function extractVersion(input: string) {
  const versionRegex = /\b\d+(\.\d+)+(-\S+)?\b/;
  const match = input.match(versionRegex);

  return match ? match[0] : undefined;
}

export default fetchApkDetails;
