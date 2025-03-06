import {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../../services/spotifyService";
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const loggedIn = req.session.uid;

    if (!loggedIn) {
        res.status(401).json({error: "Not logged in"});
        return;
    }

    const currentlyPlaying = (await getCurrentlyPlaying(loggedIn));
    if (!currentlyPlaying) {
        res.status(204).json({message: "no track playing"});
        return;
    }
    res.json(currentlyPlaying);
});

export default router;