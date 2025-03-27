import {Request, Response} from "express";
import {getById} from "@/shared/services/trackService";
import {reportError} from "../../util/exceptions";

export async function getTrackById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({message: "Id must be a whole number"});
            return;
        }

        const data = await getById(id);
        if (!data) {
            res.status(404).json({message: "Track not found"});
            return;
        }

        res.json(data);
    } catch (e: any) {
        reportError("Error in track controller", e, res);
    }
}