import {NextFunction, Request, Response} from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session.uid) {
        next();
        return;
    }

    res.status(403).json({error: "Not logged in"});
}