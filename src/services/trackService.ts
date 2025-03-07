import {desc, eq, sql} from "drizzle-orm";
import {db} from "../db";
import {artists, artistTracks, tracks, userTracks} from "../db/schema";
import {Artist, DetailedTrack} from "../types";

export const getRecentTracks = async (uid: number, count: number = 20): Promise<DetailedTrack[]> => {
    return await db
        .select({
            id: tracks.id,
            spotifyId: tracks.spotifyId,
            trackName: tracks.trackName,
            album: tracks.album,
            durationMs: tracks.durationMs,
            imageUrl: tracks.imageUrl,
            createdAt: tracks.createdAt,
            playedAt: userTracks.playedAt,
            artists: sql.raw(`json_agg(json_build_object(
                'id', artists.id,
                'spotifyId', artists.spotify_id,
                'artistName', artists.artist_name,
                'imageUrl', artists.image_url,
                'createdAt', artists.created_at
            ))`).as("artists"),
        })
        .from(tracks)
        .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
        .innerJoin(artistTracks, eq(artistTracks.trackId, tracks.id))
        .innerJoin(artists, eq(artists.id, artistTracks.artistId))
        .where(eq(userTracks.userId, uid))
        .groupBy(tracks.id, userTracks.playedAt)
        .orderBy(desc(userTracks.playedAt))
        .limit(count)
        .then(rows =>
            rows.map(row => ({
                ...row,
                artists: typeof row.artists === "string" ? JSON.parse(row.artists) : row.artists, // Ensure proper JSON parsing
            }))
        );
};


export const getTopMostListenedTracks = async (count: number = 20): Promise<Omit<DetailedTrack, "playedAt">[]> => {
    const sq = db.$with("sq").as(
        db
            .select({
                id: tracks.id,
                spotifyId: tracks.spotifyId,
                trackName: tracks.trackName,
                album: tracks.album,
                durationMs: tracks.durationMs,
                imageUrl: tracks.imageUrl,
                createdAt: tracks.createdAt,
                playCount: sql<number>`COUNT(${userTracks.trackId})`.as("playCount")
            })
            .from(tracks)
            .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
            .groupBy(tracks.id, tracks.spotifyId, tracks.trackName, tracks.album, tracks.durationMs, tracks.imageUrl, tracks.createdAt)
    );

    // @ts-ignore
    return db
        .with(sq)
        .select({
            id: sq.id,
            spotifyId: sq.spotifyId,
            trackName: sq.trackName,
            album: sq.album,
            durationMs: sq.durationMs,
            imageUrl: sq.imageUrl,
            createdAt: sq.createdAt,
            playCount: sq.playCount,
            artists: sql.raw(`
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', artists.id,
                    'spotifyId', artists.spotify_id,
                    'imageUrl', artists.image_url,
                    'createdAt', artists.created_at,
                    'artistName', artists.artist_name
                )
            )
        `).as("artists")
        })
        .from(sq)
        .leftJoin(artistTracks, eq(artistTracks.trackId, sq.id))
        .leftJoin(artists, eq(artistTracks.artistId, artists.id))
        .limit(count)
        .groupBy(sq.id, sq.spotifyId, sq.trackName, sq.album, sq.durationMs, sq.imageUrl, sq.createdAt, sq.playCount)
        .orderBy(desc(sq.playCount));


};