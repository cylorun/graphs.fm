import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWTUser} from "@/shared/types";

const JWT_SECRET = process.env.JWT_SECRET!;

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies["token"];
    if (!token) {
        res.status(401).json({message: "Access denied"});
        return;
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET) as JWTUser;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}


// sets up req.user, required to add as middleware if you wanna use access that
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies["token"];
    if (token) {
        req.user = jwt.verify(token, JWT_SECRET) as JWTUser;
    }

    next();
}