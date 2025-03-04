import express, {Request, Response} from 'express';
const app = express();

import * as dotenv from 'dotenv'
dotenv.config();

import cors from 'cors';
import cookieParser from "cookie-parser";
import * as path from "path";
import session from "express-session";
import pg from "pg";
import pgSession from "connect-pg-simple";

import homeRoutes from "./routes/home";
import statusRoutes from "./routes/api/status/status";
import spotifyCallbackRoutes from './routes/auth/spotify/callback';
import spotifyLoginRoutes from './routes/auth/spotify/login';
import logoutRoutes from './routes/auth/logout';

const PORT = Number(process.env.PORT) || 7000;
const ENVIRONMENT = process.env.ENVIRONMENT || "dev";

if (ENVIRONMENT === "production") {
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
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views', 'pages'));
app.set('view engine', 'ejs');
app.use(express.json());

// API Routes
app.use('/api/status', statusRoutes)

// Auth routes
app.use('/auth/spotify/callback', spotifyCallbackRoutes);
app.use('/auth/spotify/login', spotifyLoginRoutes);
app.use('/auth/logout', logoutRoutes);

// Routes
app.use('/', homeRoutes);

// Not found page
app.use((req: Request, res: Response) => {
     res.status(404).json({error: "not found"})
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