import {Request, Response} from 'express';
import { randomBytes } from 'node:crypto';
import * as fs from "node:fs";

let siteVersion: string | null = null;

export function randomString(length: number): string {
    if (length % 2 !== 0) {
        length++;
    }

    return randomBytes(length / 2).toString("hex");
}

export function getSiteVersion(): string {
    if (!siteVersion) {
        siteVersion = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'})).version;
    }

    return siteVersion!;
}


export function getDefaultEjsProps(req: Request, res: Response) {
    const loggedIn = !!req.session?.uid;
    const userId = req.session?.uid;

    const version = getSiteVersion();

    return {version, loggedIn, userId}
}