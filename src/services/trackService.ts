import { sql } from "drizzle-orm";
import { db } from "../db";
import { artists, artistTracks, tracks, userTracks } from "../db/schema";
import { desc, eq } from "drizzle-orm";
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
    return await db
        .select({
            id: tracks.id,
            spotifyId: tracks.spotifyId,
            trackName: tracks.trackName,
            album: tracks.album,
            durationMs: tracks.durationMs,
            imageUrl: tracks.imageUrl,
            createdAt: tracks.createdAt,
            playCount: sql<number>`COUNT(user_tracks.track_id)`.as("playCount"),
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
        .groupBy(tracks.id)
        .orderBy(desc(sql`COUNT(user_tracks.track_id)`))
        .limit(count)
        .then(rows =>
            rows.map(row => ({
                ...row,
                artists: typeof row.artists === "string" ? JSON.parse(row.artists) : row.artists,
            }))
        );
};

export const getTopMostListenedArtists = async (count: number = 20): Promise<Artist[]> => {
    return await db
        .select({
            id: artists.id,
            spotifyId: artists.spotifyId,
            artistName: artists.artistName,
            imageUrl: artists.imageUrl,
            createdAt: artists.createdAt,
            playCount: sql<number>`COUNT(user_tracks.track_id)`.as("playCount"),
        })
        .from(artists)
        .innerJoin(artistTracks, eq(artistTracks.artistId, artists.id))
        .innerJoin(tracks, eq(tracks.id, artistTracks.trackId))
        .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
        .groupBy(artists.id)
        .orderBy(desc(sql`COUNT(user_tracks.track_id)`))
        .limit(count);
};


