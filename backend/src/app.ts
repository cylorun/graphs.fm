import express, {Request, Response} from 'express';
const app = express();

import * as dotenv from 'dotenv'
dotenv.config();

import cors from 'cors';
import cookieParser from "cookie-parser";
import session from "express-session";
declare module "express-session" {
    interface SessionData {
        uid?: number;
    }
}

import pg from "pg";
import pgSession from "connect-pg-simple";

import statusRoutes from "./routes/api/status";
import userApiRoutes from "./routes/api/user";
import globalDataRoutes from "./routes/api/global";
import artistApiRoutes from './routes/api/artist'

import spotifyCallbackRoutes from './routes/auth/spotify/callback';
import spotifyLoginRoutes from './routes/auth/spotify/login';
import logoutRoutes from './routes/auth/logout';
import {getDefaultEjsProps} from "./util/util";



const PORT = 5000;
const NODE_ENV = process.env.NODE_ENV || "dev";

if (NODE_ENV === "production") {
    app.set('trust proxy', 1); // to correctly identify IPs
}

const PgSessionStore = pgSession(session);
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(cookieParser());
app.use(
    session({
        store: new PgSessionStore({ pool: pgPool }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    })
);

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// API Routes
app.use('/api/status', statusRoutes)
app.use('/api/users', userApiRoutes);
app.use('/api/artists', artistApiRoutes);
app.use('/api/global', globalDataRoutes);

// Auth routes
app.use('/auth/spotify/callback', spotifyCallbackRoutes);
app.use('/auth/spotify/login', spotifyLoginRoutes);
app.use('/auth/logout', logoutRoutes);

// Not found page
app.use((req: Request, res: Response) => {
    res.status(404).json({error: "Not found"});
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:");
    console.error("Error name: " + err.name);
    console.error("Error message: " + err.message);
    console.error("Stack trace:\n" + err.stack);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`http://localhost:${PORT}`);
});