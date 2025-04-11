import {Request, Response} from 'express';
import {
    getHourlyListeningStats,
    getUserById,
    getUserId,
    getUserPlaycount,
    getUserProfileImageUrl,
    resolveUid
} from "@/shared/services/userService";
import {getRecentTracks, getTopUserArtists, getTopUserTracks} from "@/shared/services/trackService";
import {getCurrentlyPlaying} from "@/shared/services/spotifyService";
import {setUserTimezone} from "@/shared/services/userService";
import {reportError} from "../../util/exceptions";
import {UserNotFoundException} from "@/shared/types";

export async function getUserData(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (id) {
            const uid = await resolveUid(id);
            if (!uid) {
                res.status(404).json({message: "User not found"});
                return;
            }

            const data = await getUserById(uid);
            if (!data) {
                res.status(404).json({message: "User not found"});
                return;
            }

            const {email, ...pubdata} = data;

            res.json(pubdata);
            return;
        }

        const data = await getUserById(req.user?.id!);
        if (!data) {
            res.status(404).json({message: "User not found(idk how)"});
            return;
        }

        res.json(data);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}

export async function getUserTracks(req: Request, res: Response) {
    try {
        const uid = (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) {
            res.status(400).json({message: "No uid provided"});
            return;
        }

        const {count = 20} = req.query;
        if (isNaN(Number(count))) {
            res.status(400).json({message: "count must be a number"});
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
        const uid =  (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) {
            res.status(400).json({message: "No uid provided"});
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
        const uid = await resolveUid(req.params.id)
        if (!uid) {
            res.status(404).json({message: "User not found"});
            return;
        }

        // if url doesnt exist then i dont know what the fuck went wrong
        const url = await getUserProfileImageUrl(uid);

        res.status(200).json({url: url});
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}


export async function getNowPlaying(req: Request, res: Response) {
    try {
        const uid =  (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) {
            res.status(400).json({message: "No uid provided"});
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
            res.status(404).json({message: "User not found"});
            return;
        }

        reportError("AN error occured in  userapicontroller", e, res);
    }
}


export async function getTopTracks(req: Request, res: Response) {
    try {
        const uid =  (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) {
            res.status(400).json({message: "No uid provided"});
            return;
        }

        const d = await getTopUserTracks(20, uid);
        res.json(d);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}

export async function getTopArtists(req: Request, res: Response) {
    try {
        const uid =  (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) {
            res.status(400).json({message: "No uid provided"});
            return;
        }

        const d = await getTopUserArtists(20, uid);
        res.json(d);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}

export async function setTimezone(req: Request, res: Response) {
    try {
        const uid = req.user?.id;
        if (!uid) { // should never happen cause this function should always be after the 'requireAuth' middleware function
            res.status(401).json({message: "Not logged in"});
            return;
        }

        const {timezone} = req.body;
        if (!timezone) {
            res.status(400).json({message: "Timezone not provided"});
            return;
        }

        await setUserTimezone(uid, timezone);
        res.json({message: "Success"});
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}

export async function getHourlyListeningCount(req: Request, res: Response) {
    try {
        const uid =  (await resolveUid(req.params.id)) || req.user?.id;
        if (!uid) { // should never happen cause this function should always be after the 'requireAuth' middleware function
            res.status(401).json({message: "Not logged in"});
            return;
        }

        const d = await getHourlyListeningStats(uid);
        res.json(d);
    } catch (e: any) {
        reportError("AN error occured in  userapicontroller", e, res);
    }
}