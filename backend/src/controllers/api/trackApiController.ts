import {Request, Response} from "express";
import {getDetailedById, getTrackPlayCount, getTrackPlayCountForUser} from "@/shared/services/trackService";
import {reportError} from "../../util/exceptions";
import {getAlbumById, getAlbumBySpotifyID} from "@/shared/services/albumService";

export async function getTrackById(req: Request, res: Response) {
    try {
        const trackId = parseInt(req.params.id);
        if (isNaN(trackId)) {
            res.status(400).json({message: "Id must be a whole number"});
            return;
        }

        let data = await getDetailedById(trackId);
        if (!data) {
            res.status(404).json({message: "Track not found"});
            return;
        }

        const totalPlays = await getTrackPlayCount(trackId);

        const {albumdata = "0", userdata = "0"} = req.query;
        const includeAlbumData = albumdata === "1";
        const includeUserData = userdata === "1";

        if (includeAlbumData) {
            const album = await getAlbumById(data.albumId);

            data = {...data, album: album}
        }

        if (includeUserData && req.user?.id) {
            const userPlays = await getTrackPlayCountForUser(req.user?.id, trackId);
            data = {...data, yourPlaycount: userPlays};
        }

        res.json({...data, plays: totalPlays});
    } catch (e: any) {
        reportError("Error in track controller", e, res);
    }
}