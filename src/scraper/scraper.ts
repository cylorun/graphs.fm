import dotenv from "dotenv";
dotenv.config();

import schedule from "node-schedule";

import {db} from "../db";
import {users, userTracks, tracks, artistTracks} from "../db/schema";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {Track} from "../types";
import {desc, eq} from "drizzle-orm";


async function insertUserTrack(uid: number, track: Track): Promise<void> {
    await db.insert(userTracks).values({userId: uid, trackId: track.id});
}

async function shouldInsertTrack(uid: number, track: Track): Promise<boolean> {
    const lastTrack = await db
        .select({
            trackId: tracks.spotifyId
        })
        .from(userTracks)
        .innerJoin(tracks, eq(userTracks.trackId, tracks.id))
        .where(eq(userTracks.userId, uid))
        .orderBy(desc(userTracks.playedAt))
        .limit(1)
        .then(rows => rows[0]?.trackId);

    if (!lastTrack) return true;

    return lastTrack !== track.spotifyId;
}

async function run() {
    try {
        const uids = await db.select({id: users.id}).from(users);
        await Promise.all(uids.map(async ({id})=>{
            const curr = await getCurrentlyPlaying(id);
            if (curr && (await shouldInsertTrack(id, curr))) {
                await insertUserTrack(id, curr);
            }
        }));
    } catch (e: any) {
        console.error("An error occured in scraper: ", e.message);
        console.error("stack: \n", e.stack);
    }
}

// every 20s
schedule.scheduleJob("*/20 * * * * *", () => {
    run();
});