import {Request, Response, Router} from "express";
import {getCurrentlyPlaying, getRecentTracks} from "../services/spotifyService";
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const loggedIn = req.session.uid;

    if (!loggedIn) {
        res.redirect('/login');
        return;
    }

    const recentTracks = await getRecentTracks(loggedIn);
    const currentTrack = await getCurrentlyPlaying(loggedIn);
    res.render("dashboard", {recentTracks, currentTrack});
});

export default router;