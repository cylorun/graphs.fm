import {Router} from "express";
import {getTrackById} from "../../controllers/api/trackApiController";

const router = Router();
/**
 * Returns track data for the given id
 * Query {
 *     albumdata: 1 or 0, whether to include album data or not
 * }
 * Example response {
 *   "id": 95,
 *   "spotifyId": "5fwSHlTEWpluwOM0Sxnh5k",
 *   "trackName": "Pepas",
 *   "albumId": 4,
 *   "durationMs": 287120,
 *   "imageUrl": "https://i.scdn.co/image/ab67616d0000b2734239a6aa89738d8f798168ad",
 *   "createdAt": "2025-04-05T23:50:07.056Z",
 *   "artists": [
 *     {
 *       "id": 36,
 *       "spotifyId": "329e4yvIujISKGKz1BZZbO",
 *       "artistName": "Farruko",
 *       "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb7d36b670eff30cc4de53f67c",
 *       "createdAt": "2025-04-05T23:50:06.248423"
 *     }
 *   ]
 * }
 *
 * Example with album data: {
 *   "id": 101,
 *   "spotifyId": "6MpCaSIOfqBqbMED4kXgNY",
 *   "trackName": "Prom Queen",
 *   "albumId": 10,
 *   "durationMs": 136562,
 *   "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730ec9ae111708f4b8be932d8b",
 *   "createdAt": "2025-04-06T00:11:06.857Z",
 *   "artists": [
 *     {
 *       "id": 43,
 *       "spotifyId": "2vnB6tuQMaQpORiRdvXF9H",
 *       "artistName": "Beach Bunny",
 *       "imageUrl": "https://i.scdn.co/image/ab6761610000e5ebc76f04ab8987c4fb298abb3c",
 *       "createdAt": "2025-04-06T00:11:06.493018"
 *     }
 *   ],
 *   "album": {
 *     "id": 10,
 *     "spotifyId": "1lgr82yCJYR5lgsSyxXgBH",
 *     "albumName": "Prom Queen",
 *     "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730ec9ae111708f4b8be932d8b",
 *     "releaseDate": "2018-08-10",
 *     "releaseDatePrecision": "day",  this is only ( year | month | day )
 *     "artistId": 43,
 *     "createdAt": "2025-04-06T00:11:06.796Z"
 *   }
 * }
 */
router.get('/:id', getTrackById);


export default router;