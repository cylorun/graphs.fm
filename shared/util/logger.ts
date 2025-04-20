import fs from 'fs'
import pino from 'pino'
import pretty from 'pino-pretty'
import dotenv from "dotenv";
dotenv.config();

const SERVICE_NAME = process.env.SERVICE_NAME!;
const NODE_ENV = process.env.NODE_ENV || "dev";

if (!['backend', 'scraper', 'websocket', 'frontend'].includes(SERVICE_NAME)) {
    throw new Error("Invalid SERVICE_NAME env");
}

const logFs = fs.createWriteStream(`./logs/${SERVICE_NAME}.log`, { flags: 'a' })

const logger = pino(
    {
        level: NODE_ENV === "production" ? 'info' : 'trace', // logs the level and everything above it.
    },
    pino.multistream([
        {
            stream: pretty({colorize: true}) // stdout logging
        },
        {
            stream: logFs
        },
    ])
);


export {logger};