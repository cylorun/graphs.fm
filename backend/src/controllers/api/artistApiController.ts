import {getArtistById, getArtistGenres} from "@/shared/services/artistService";
import {Request, Response} from "express";
import {getUserArtistListenPoints, getUserTrackListenPoints, resolveUid} from "@/shared/services/userService";
import {reportError} from "../../util/exceptions";

export async function getArtistData(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        res.status(400).json({error: "id must be a number"});
        return;
    }

    const data = await getArtistById(id);
    if (!data) {
        res.status(404).json({error: "Artist not found"});
        return;
    }

    const genres = await getArtistGenres(id);

    res.status(200).json({
        ...data,
        genres,
    });
}

export async function getUserArtistData(req: Request, res: Response) {
    try {
        const artistId = parseInt(req.params.artist_id);
        const userId = await resolveUid(req.params.user_id);

        if (!userId) {
            res.status(404).json({message: "User not found"});
            return;
        }

        if (isNaN(artistId)) {
            res.status(400).json({message: "Invalid artist id"});
            return;
        }

        const data = await getUserArtistListenPoints(userId, artistId);
        if (!data) {
            res.status(500).json({message: "Something went wrong"});
            return;
        }

        res.json(data);
    } catch (e: any) {
        reportError("Error in artist controller", e, res);
    }
}