import {Router} from "express";
import {
    getUserPfp,
    getUserPlayCount,
    getUserData,
    getUserTracks,
    getNowPlaying
} from '../../controllers/api/userApiController'
import {requireAuth} from "../../middleware";

const router = Router();


/**
 * Relies on sessions to get the data for the logged in user
 *
 * Example response: {
 *   "id": 1,
 *   "spotifyId": "31b6uc5ivi7ocv6zfoefnwyrh45m",
 *   "displayName": "cylorun",
 *   "email": "cylorun@gmail.com",
 *   "profileImage": "https://i.scdn.co/image/ab6775700000ee8583623c574dfc7f0c4a63ec97",
 *   "createdAt": "2025-03-10T22:54:52.654Z",
 *   "lastLogin": "2025-03-11T15:54:49.552Z"
 * }
 */
router.get('/', requireAuth, getUserData);

router.get('/:id', getUserData);

/**
 * Relies on sessions to get data for the logged in user
 *
 * Example response: {
 *   "id": 19,
 *   "spotifyId": "6IRzBP4gVoV4D2zHmocoWy",
 *   "trackName": "Eternal Summer",
 *   "album": "The New Abnormal",
 *   "durationMs": 375320,
 *   "imageUrl": "https://i.scdn.co/image/ab67616d0000b273bfa99afb5ef0d26d5064b23b",
 *   "createdAt": "2025-03-11T17:12:40.659Z",
 *   "playedAt": "2025-03-11T17:17:43.481Z",
 *   "artists": [
 *     {
 *       "id": 5,
 *       "spotifyId": "0epOFNiUfyON9EYx7Tpr6V",
 *       "artistName": "The Strokes",
 *       "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebc3b137793230f4043feb0089",
 *       "createdAt": "2025-03-11T16:03:00.903Z"
 *     }
 *   ]
 * }
 */
router.get('/now-playing', requireAuth, getNowPlaying);
router.get('/:id/now-playing', getNowPlaying);

/**
 * Relies on sessions to get data for the logged in user
 *
 * Query: {
 *     count, optional, defaults to 20. Returns the last `count` tracks
 * }
 *
 * Example Response: [
 *   {
 *     "id": 19,
 *     "spotifyId": "6IRzBP4gVoV4D2zHmocoWy",
 *     "trackName": "Eternal Summer",
 *     "album": "The New Abnormal",
 *     "durationMs": 375320,
 *     "imageUrl": "https://i.scdn.co/image/ab67616d0000b273bfa99afb5ef0d26d5064b23b",
 *     "createdAt": "2025-03-11T17:12:40.659Z",
 *     "playedAt": "2025-03-11T17:12:40.947Z",
 *     "artists": [
 *       {
 *         "id": 5,
 *         "spotifyId": "0epOFNiUfyON9EYx7Tpr6V",
 *         "artistName": "The Strokes",
 *         "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebc3b137793230f4043feb0089",
 *         "createdAt": "2025-03-11T16:03:00.903616"
 *       }
 *     ]
 *   },
 *   {
 *     "id": 18,
 *     "spotifyId": "0MMyJUC3WNnFS1lit5pTjk",
 *     "trackName": "jealousy, jealousy",
 *     "album": "SOUR",
 *     "durationMs": 173160,
 *     "imageUrl": "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
 *     "createdAt": "2025-03-11T17:09:40.679Z",
 *     "playedAt": "2025-03-11T17:09:40.939Z",
 *     "artists": [
 *       {
 *         "id": 7,
 *         "spotifyId": "1McMsnEElThX1knmY4oliG",
 *         "artistName": "Olivia Rodrigo",
 *         "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4",
 *         "createdAt": "2025-03-11T16:28:01.468021"
 *       }
 *     ]
 *   }
 * ]
 */
router.get('/tracks', requireAuth, getUserTracks);
router.get('/:id/tracks', getUserTracks);


/**
 *
 * Relies on sessions to get data for the logged in user
 *
 * {
 *   "day": 19,
 *   "week": 19,
 *   "month": 19
 * }
 */
router.get('/playcount', requireAuth, getUserPlayCount);
router.get('/:id/playcount', getUserPlayCount);


/**
 * Example response for url /api/users/1/pfp: {
 *   "url": "https://i.scdn.co/image/ab6775700000ee8583623c574dfc7f0c4a63ec97"
 * }
 */
router.get('/:id/pfp', getUserPfp);

export default router;