import dotenv from "dotenv";
dotenv.config();

import schedule from "node-schedule";

import {db} from "@/shared/db";
import {users, userTracks, tracks} from "@/shared/drizzle/schema";
import {getCurrentlyPlaying} from "@/shared/services/spotifyService";
import {Track} from "@/shared/types";
import {desc, eq} from "drizzle-orm";
import moment from "moment";
import { createClient } from 'redis';
import {logger} from "@/shared/util/logger";

const redis = createClient({url: process.env.REDIS_URL!});
(async () => {
    await redis.connect();
})();

async function onTrackChange(uid: number, track: Track): Promise<void> {
    await db.insert(userTracks).values({userId: uid, trackId: track.id});

    const payload = JSON.stringify({
        userId: uid,
        trackId: track.id
    });

    await redis.publish('track-updates', payload);
    logger.debug('Redis updates successfully.', payload);
}


async function shouldInsertTrack(uid: number, track: Track): Promise<boolean> {
    const lastTrack = await db
        .select({
            trackId: tracks.id,
            playedAt: userTracks.playedAt,
            durationMs: tracks.durationMs
        })
        .from(userTracks)
        .innerJoin(tracks, eq(userTracks.trackId, tracks.id))
        .where(eq(userTracks.userId, uid))
        .orderBy(desc(userTracks.playedAt))
        .limit(1)
        .then(rows => rows[0]);

    // if no last track, or it's different from current, it's safe to insert
    if (!lastTrack || lastTrack.trackId !== track.id) return true;

    const lastTrackEndTime = moment(lastTrack.playedAt).add(lastTrack.durationMs, "ms");
    const currentTime = moment();

    // check if the track ended before the current time, meaning we can insert again
    return currentTime.isAfter(lastTrackEndTime);
}


async function run() {
    try {
        const uids = await db.select({id: users.id}).from(users);
        await Promise.all(uids.map(async ({id})=>{
            const curr = await getCurrentlyPlaying(id);
            if (curr && (await shouldInsertTrack(id, curr))) {
                await onTrackChange(id, curr);
            }
        }));
    } catch (e: any) {
        logger.error(`An error occured in scraper: ${e.message}\\n stack:\\n ${e.stack}`);
    }
}

// every 20s
schedule.scheduleJob("*/10 * * * * *", () => {
    run();
});