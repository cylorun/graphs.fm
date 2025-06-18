import {NewUser} from "@/shared/types";
import jwt from 'jsonwebtoken';
import {Response} from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;
const NODE_ENV = process.env.NODE_ENV!;

export const generateToken = (user: NewUser) => {
    return jwt.sign({
        id: user.id,
        role: user.role,
        username: user.username,
        spotifyId: user.spotifyId,
    }, JWT_SECRET, {expiresIn: 60 * 60 * 24 * 7}); // 7 days in seconds
}

export const saveTokenAsCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
