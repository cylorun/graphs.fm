import {Request, Response} from "express";
import {logger} from "@/shared/util/logger";


export function reportError(message: string, error?: Error, res?: Response): void {
    logger.error(message);
    error ? logger.error(error.message, error.stack) : null;

    res?.status(500).send("Sorry something went very wrong");
}

export function handleReqError(req: Request, res: Response, msg?: string): void {
    res.status(500).send(msg || "Sorry something went wrong");
}