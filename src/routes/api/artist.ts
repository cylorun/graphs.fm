import {Router} from "express";
import {getArtistData} from "../../controllers/api/artistApiController";

const router = Router();


/**
 * Returns artist data, along with genres for a given artist(by id)
 *
 *
 * {
 *   "id": 5,
 *   "spotifyId": "0epOFNiUfyON9EYx7Tpr6V",
 *   "artistName": "The Strokes",
 *   "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebc3b137793230f4043feb0089",
 *   "createdAt": "2025-03-11T16:03:00.903Z",
 *   "genres": [
 *     {
 *       "id": 3,
 *       "genreName": "garage rock",
 *       "createdAt": "2025-03-11T16:03:00.903Z"
 *     },
 *     {
 *       "id": 4,
 *       "genreName": "indie rock",
 *       "createdAt": "2025-03-11T16:03:00.903Z"
 *     },
 *     {
 *       "id": 5,
 *       "genreName": "alternative rock",
 *       "createdAt": "2025-03-11T16:03:00.903Z"
 *     }
 *   ]
 * }
 */
router.get("/:id", getArtistData);


export default router;