import {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {getRecentTracks} from '../services/trackService';
import moment from "moment";


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
    const recentTracks = (await getRecentTracks(id)).map(track => {
        const playedAt = moment(track.playedAt).fromNow();
        return { ...track, playedAt }
    });

    const currentTrack = await getCurrentlyPlaying(id);

    res.render("user", {recentTracks, currentTrack, loggedIn, isYou, userId: req.session?.uid});
});

export default router;