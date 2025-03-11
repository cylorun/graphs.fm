import {Request, Response} from "express";


export function reportError(message: string, error?: Error, res?: Response): void {
    console.error(message);
    error ? console.error(error.message, error.stack) : null;

    res?.send("Sorry something went very wrong");
}

export function handleReqError(req: Request, res: Response, msg?: string): void {
    res.status(500).send(msg || "Sorry something went wrong");
}