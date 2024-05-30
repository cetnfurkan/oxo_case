import { Router } from 'express';
import { getAllVersions, getVersionDetails, deleteVersion, updateVersion, checkAgent } from '../controllers/apkController';

const router = Router();

/**
 * @route GET /versions
 * @description Get all APK versions, sorted by release date in descending order.
 * @access Public
 */
router.get('/versions', getAllVersions);

/**
 * @route GET /version/:id
 * @description Get details of a specific version by ID.
 * @access Public
 */
router.get('/version/:id', getVersionDetails);

/**
 * @route DELETE /version/:id
 * @description Delete a specific version by ID.
 * @access Public
 */
router.delete('/version/:id', deleteVersion);

/**
 * @route PUT /version/:id
 * @description Update a specific version by ID.
 * @access Public
 */
router.put('/version/:id', updateVersion);

/**
 * @route POST /check-agent
 * @description Check if the user agent matches any APK version in the database and if the version is acceptable.
 * @access Public
 */
router.post('/check-agent', checkAgent);

export default router;
