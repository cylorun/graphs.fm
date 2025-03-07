import {Request, Response} from "express";


export function reportError(message: string, error?: Error): void {
    console.error(message);
    error ? console.error(error?.stack) : null;
}

export function handleReqError(req: Request, res: Response, msg?: string): void {
    res.status(500).send(msg || "Sorry something went wrong");
}