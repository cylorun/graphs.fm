import {Request, Response, Router} from "express";
import {getTopMostListenedTracks} from "../services/trackService";
import {getTopArtists} from "../services/artistService";

const router = Router();


router.get('/', async (req: Request, res: Response) => {
    const loggedIn = !!req.session?.uid;
    const id = parseInt(req.params.id);

    const isYou = id === req.session?.uid; // if it's your profile

    const topTracks = await getTopMostListenedTracks()
    console.dir(topTracks, {depth: null})
    const topArtists = await getTopArtists();

    res.render("global", {loggedIn, isYou, userId: req.session?.uid, topTracks, topArtists});
});

export default router;