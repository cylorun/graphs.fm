import {Request, Response} from 'express';
import {getUserById, getUserId, getUserPlaycount, getUserProfileImageUrl, resolveUid} from "../../services/userService";
import {getRecentTracks} from "../../services/trackService";
import {getCurrentlyPlaying} from "../../services/spotifyService";
import {reportError} from "../../util/exceptions";
import {UserNotFoundException} from "../../types";

export async function getUserData(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (id) {
            const uid = await resolveUid(id);
            if (!uid) {
                res.status(404).json({error: "User not found"});
                return;
            }

            const data = await getUserById(uid);
            if (!data) {
                res.status(404).json({error: "User not found"});
                return;
            }

            const {email, ...pubdata} = data;

            res.json(pubdata);
            return;
        }

        const data = await getUserById(req.session.uid!);
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
        const uid =  parseInt(req.params.id) || req.session.uid;
        if (!uid) {
            res.status(400).json({error: "No uid provided"});
            return;
        }
        const {count = 20} = req.query;
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
        const uid =  parseInt(req.params.id) || req.session.uid;
        if (!uid) {
            res.status(400).json({error: "No uid provided"});
            return;
        }
        const playCountData = await getUserPlaycount(uid);

        res.json(playCountData);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
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
        const uid =  parseInt(req.params.id) || req.session.uid;
        if (!uid) {
            res.status(400).json({error: "No uid provided"});
            return;
        }

        const currentlyPlaying = (await getCurrentlyPlaying(uid));
        if (!currentlyPlaying) {
            res.status(204).json({message: "no track playing"});
            return;
        }

        res.json(currentlyPlaying);
    } catch (e: any) {
        if (e instanceof UserNotFoundException) {
            res.status(404).json({error: "User not found"});
            return;
        }

        reportError("AN error occured in  userapicontroller", e, res);
    }
}