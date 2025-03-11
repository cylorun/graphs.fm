import {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {getRecentTracks} from '../services/trackService';
import moment from "moment";
import {handleReqError} from "../util/exceptions";
import {getUserPlaycount} from "../services/userService";


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const loggedIn = !!req.session?.uid;
        if (!loggedIn) {
            res.redirect('/login');
            return;
        }

        res.redirect(`/user/${req.session.uid}`);
    } catch (e) {
        handleReqError(req, res);
    }

});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const loggedIn = !!req.session?.uid;
        const id = parseInt(req.params.id);

        const isYou = id === req.session?.uid; //if it's your profile
        const recentTracks = (await getRecentTracks(id)).map(track => {
            const playedAt = moment(track.playedAt).fromNow();
            return { ...track, playedAt };
        });

        const userPlayCount = await getUserPlaycount(id);
        const currentTrack = await getCurrentlyPlaying(id);

        res.render("user", {recentTracks, currentTrack, loggedIn, isYou, userId: req.session?.uid, userPlayCount});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;