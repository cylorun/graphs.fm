import {Request, Response} from 'express';
import {getTotalPlayCount} from "../../services/trackService";
import {reportError} from "../../util/exceptions";

export async function getGlobalPlayCount(req: Request, res: Response) {
    try {
        const data = await getTotalPlayCount();

        res.status(200).json({count: data});
    } catch (e: any) {
        reportError("AN error occured in global playcount controller", e);
    }
}