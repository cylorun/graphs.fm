import {Request, Response, Router} from "express";
import {getTopMostListenedTracks} from "../services/trackService";
import {getTopArtists} from "../services/artistService";
import {handleReqError} from "../util/exceptions";
import {getDefaultEjsProps} from "../util/util";

const router = Router();


router.get('/', async (req: Request, res: Response) => {
    try {
        const topTracks = await getTopMostListenedTracks()
        const topArtists = await getTopArtists();

        res.render("global", {...getDefaultEjsProps(req, res), topTracks, topArtists});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;