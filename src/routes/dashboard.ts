import {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {getRecentTracks} from '../services/trackService';


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const loggedIn = req.session?.uid;

    if (!loggedIn) {
        res.redirect('/login');
        return;
    }

    const recentTracks = await getRecentTracks(loggedIn);
    const currentTrack = await getCurrentlyPlaying(loggedIn);

    res.render("dashboard", {recentTracks, currentTrack, loggedIn});
});

export default router;