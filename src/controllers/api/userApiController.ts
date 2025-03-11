import {Request, Response} from 'express';
import {getUserById, getUserPlaycount, getUserProfileImageUrl} from "../../services/userService";
import {getRecentTracks} from "../../services/trackService";
import {getCurrentlyPlaying} from "../../services/spotifyService";
import {reportError} from "../../util/exceptions";

export async function getUserData(req: Request, res: Response) {
    try {
        if (!req.session.uid) {
            res.status(403).json({error: "Not logged in"});
            return;
        }

        const data = await getUserById(req.session.uid);
        if (!data) {
            res.status(404).json({error: "User not found(idk how)"});
            return;
        }

        res.json(data);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}

export async function getUserTracks(req: Request, res: Response) {
    try {
        if (!req.session.uid) {
            res.status(403).json({error: "Not logged in"});
            return;
        }

        const uid = req.session.uid;
        const {count = 20} = req.params;
        if (isNaN(Number(count))) {
            res.status(400).json({error: "count must be a number"});
            return;
        }

        const tracks = await getRecentTracks(uid, Math.min(Math.round(Number(count)), 100));
        res.json(tracks);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }

}



export async function getUserPlayCount(req: Request, res: Response) {
    try {
        if (!req.session.uid) {
            res.status(403).json({error: "Not logged in"});
            return;
        }

        const uid = req.session.uid;

        const playCountData = await getUserPlaycount(uid);
        res.json(playCountData);
    } catch (e) {

    }

}



export async function getUserPfp(req: Request, res: Response) {
    try {
        const uid = parseInt(req.params.id);
        if (isNaN(uid)) {
            res.status(400).json({error: "Invalid uid"});
            return;
        }

        const url = await getUserProfileImageUrl(uid);
        if (!url) {
            res.status(404).json({error: "User not found"});
            return;
        }

        res.status(200).json({url: url});
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }

}

export async function getNowPlaying(req: Request, res: Response) {
    try {
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
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }

}