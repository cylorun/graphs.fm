import {Request, Response, Router} from "express";
import {randomString} from "../../../util/util";
import * as querystring from "node:querystring";

const router = Router();

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

const SCOPES =
    [
        'user-read-currently-playing',
        'user-follow-read',
        'user-read-recently-played',
        'user-read-email'
    ].join(' ');


router.get('/', (req: Request, res: Response) => {
    const state = randomString(16);
    console.log(REDIRECT_URI);
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI,
            state: state
        }));
});

export default router;