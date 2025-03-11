import {Router} from 'express';
import {getGlobalPlayCount} from "../../controllers/api/globalDataApiController";

const router = Router();


/**
 * Example response: {
 *   "count": 18
 * }
 */
router.get('/playcount', getGlobalPlayCount);

export default router;