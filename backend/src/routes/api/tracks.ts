import {Router} from "express";
import {getTrackById} from "../../controllers/api/trackApiController";

const router = Router();
/**
 * Returns track data for the given id
 * Example response {
 *     "id": 50,
 *     "spotifyId": "2Sd2Oa9EPi34xAF2n5G0Dg",
 *     "trackName": "Life Sux",
 *     "album": "Alive and Unwell",
 *     "durationMs": 174814,
 *     "imageUrl": "https://i.scdn.co/image/ab67616d0000b2732f35152ea0744bab4fafac46",
 *     "createdAt": "2025-03-24T00:23:02.074Z",
 *     "artists": [
 *         {
 *             "id": 6,
 *             "spotifyId": "6oWOHAOyBUn6aJlKIPJK9r",
 *             "artistName": "Leah Kate",
 *             "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebfc374f78b6a35e2369a59df4",
 *             "createdAt": "2025-03-11T16:20:01.580607"
 *         }
 *     ]
 * }
 */
router.get('/:id', getTrackById);


export default router;