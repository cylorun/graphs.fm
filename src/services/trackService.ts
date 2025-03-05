import {Track} from "../types";
import {db} from "../db";
import {tracks, userTracks} from "../db/schema";
import {desc, eq} from "drizzle-orm";

export const getRecentTracks = async (uid: number, count: number = 20): Promise<Track[]> => {
    return (await db
        .select({tracks})
        .from(tracks)
        .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
        .where(eq(userTracks.userId, uid))
        .orderBy(desc(userTracks.playedAt))
        .limit(count))
        .map(a => a.tracks);
}
