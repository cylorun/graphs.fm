import {Request, Response, Router} from "express";
import {getTopMostListenedArtists, getTopMostListenedTracks} from "../services/trackService";
const router = Router();


router.get('/', async (req: Request, res: Response) => {
    const loggedIn = !!req.session?.uid;
    const id = parseInt(req.params.id);

    const isYou = id === req.session?.uid; // if it's your profile

    const topTracks = await getTopMostListenedTracks()
    const topArtists = await getTopMostListenedArtists();

    res.render("global", {loggedIn, isYou, userId: req.session?.uid, topTracks, topArtists});
});

export default router;