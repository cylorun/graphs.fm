import {getArtistById, getArtistGenres} from "../../services/artistService";
import {Request, Response} from "express";

export async function getArtistData(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        res.status(400).json({error: "id must be a number"});
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