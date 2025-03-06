import {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {getRecentTracks} from '../services/trackService';


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const loggedIn = !!req.session?.uid;
    if (!loggedIn) {
        res.redirect('/login');
        return;
    }

    res.redirect(`/user/${req.session.uid}`);
});

router.get('/:id', async (req: Request, res: Response) => {
    const loggedIn = !!req.session?.uid;
    const id = parseInt(req.params.id);

    const isYou = id === req.session?.uid; //if it's your profile

    const recentTracks = await getRecentTracks(id);
    const currentTrack = await getCurrentlyPlaying(id);

    res.render("user", {recentTracks, currentTrack, loggedIn, isYou});
});

export default router;