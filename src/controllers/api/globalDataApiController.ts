import {Request, Response} from 'express';
import {getTotalPlayCount} from "../../services/trackService";

export async function getGlobalPlayCount(req: Request, res: Response) {
    const data = await getTotalPlayCount();

    res.status(200).json({count: data});
}