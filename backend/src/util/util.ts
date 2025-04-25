import {Request, Response} from 'express';
import { randomBytes } from 'node:crypto';
import * as fs from "node:fs";
import path from 'path';

let siteVersion: string | null = null;
const NODE_ENV = process.env.NODE_ENV;
const FRONTEND_BASE_URL =  process.env.FRONTEND_URL;

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


export function redirectFrontend(res: Response, path: string) {
    if (!path) throw new Error("Path not provided");
    if (path[0] !== '/') throw new Error("Path must start with a forward slash");

    res.redirect(`${FRONTEND_BASE_URL}${path}`);
}


// recursive
export function getAllDirectoryFiles(dir: string): string[] {
    let results: string[] = [];

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllDirectoryFiles(fullPath));
        } else {
            results.push(fullPath);
        }
    });

    return results;
}
