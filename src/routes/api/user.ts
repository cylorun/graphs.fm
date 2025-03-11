import {Router} from "express";
import {
    getUserPfp,
    getUserPlayCount,
    getUserData,
    getUserTracks,
    getNowPlaying
} from '../../controllers/api/userApiController'

const router = Router();

router.get('/', getUserData);

router.get('/now-playing', getNowPlaying);

router.get('/tracks', getUserTracks);

router.get('/playcount', getUserPlayCount);

router.get('/:id/pfp', getUserPfp);

export default router;