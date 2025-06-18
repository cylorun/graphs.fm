import express, {Request, Response} from 'express';
const app = express();

import * as dotenv from 'dotenv'
dotenv.config();

import cors from 'cors';
import cookieParser from "cookie-parser";

import statusRoutes from "./routes/api/status";
import userApiRoutes from "./routes/api/users";
import globalDataRoutes from "./routes/api/global";
import artistApiRoutes from './routes/api/artists'
import tracksApiRoutes from './routes/api/tracks';
import commentsApiRoutes from './routes/api/comments';

import spotifyCallbackRoutes from './routes/auth/spotify/callback';
import spotifyLoginRoutes from './routes/auth/spotify/login';
import logoutRoutes from './routes/auth/logout';
import {JWTUser} from "@/shared/types";
import {logger} from "@/shared/util/logger";

const PORT = 5000;
const NODE_ENV = process.env.NODE_ENV || "dev";

if (NODE_ENV === "production") {
    app.set('trust proxy', 1); // to correctly identify IPs
}

declare module "express" {
    export interface Request {
        user?: JWTUser;
    }
}

app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());



// API Routes
app.use('/status', statusRoutes)
app.use('/users', userApiRoutes);
app.use('/artists', artistApiRoutes);
app.use('/tracks', tracksApiRoutes);
app.use('/comments', commentsApiRoutes);

app.use('/global', globalDataRoutes);


// Auth routes
app.use('/auth/spotify/callback', spotifyCallbackRoutes);
app.use('/auth/spotify/login', spotifyLoginRoutes);
app.use('/auth/logout', logoutRoutes);

// Not found page
app.use((req: Request, res: Response) => {
    res.status(404).json({error: "Not found"});
});

process.on("uncaughtException", (err) => {
    logger.fatal(`UNCAUGHT EXCEPTION!!\\nName: ${err.name}\\nMessage: ${err.message}\\nStack: ${err.stack}`);
});

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Backend server started up at http://localhost:${PORT}`);
});