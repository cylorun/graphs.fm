import {and, count, desc, eq, sql} from "drizzle-orm";
import {db} from "../db";
import {artists, artistTracks, tracks, users, userTracks} from "../drizzle/schema";
import {Artist, DetailedTrack, NewTrack, Track, TrackNotFoundException} from "../types";
import {createArtistsIfNotExists, linkArtistTracks} from "./artistService";
import {getSpotifyAppToken} from "./spotifyService";
import axios from "axios";
import {createAlbum, createAlbumIfNotExists, getAlbumBySpotifyID} from "./albumService";

export const getRecentTracks = async (uid: number, count: number = 20): Promise<DetailedTrack[]> => {
    return await db
        .select({
            id: tracks.id,
            spotifyId: tracks.spotifyId,
            trackName: tracks.trackName,
            albumId: tracks.albumId,
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


export const getGlobalTopTracks = async (count: number = 20): Promise<Omit<DetailedTrack, "playedAt">[]> => {
    const sq = db.$with("sq").as(
        db
            .select({
                id: tracks.id,
                spotifyId: tracks.spotifyId,
                trackName: tracks.trackName,
                albumId: tracks.albumId,
                durationMs: tracks.durationMs,
                imageUrl: tracks.imageUrl,
                createdAt: tracks.createdAt,
                playCount: sql<number>`COUNT(${userTracks.trackId})`.as("playCount")
            })
            .from(tracks)
            .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
            .groupBy(tracks.id, tracks.spotifyId, tracks.trackName, tracks.albumId, tracks.durationMs, tracks.imageUrl, tracks.createdAt)
    );

    // @ts-ignore
    return db
        .with(sq)
        .select({
            id: sq.id,
            spotifyId: sq.spotifyId,
            trackName: sq.trackName,
            album: sq.albumId,
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
        .groupBy(sq.id, sq.spotifyId, sq.trackName, sq.albumId, sq.durationMs, sq.imageUrl, sq.createdAt, sq.playCount)
        .orderBy(desc(sq.playCount));
};


export const getTopUserArtists = async (count: number = 20, uid: number): Promise<(Artist & {playCount: number})[]> => {
    const sq = db.$with("sq").as(
        db
            .select({
                artistId: artists.id,
                spotifyId: artists.spotifyId,
                artistName: artists.artistName,
                imageUrl: artists.imageUrl,
                createdAt: artists.createdAt,
                playCount: sql<number>`COUNT(${userTracks.trackId})`.as("playCount"),
            })
            .from(userTracks)
            .innerJoin(tracks, eq(userTracks.trackId, tracks.id))
            .innerJoin(artistTracks, eq(artistTracks.trackId, tracks.id))
            .innerJoin(artists, eq(artistTracks.artistId, artists.id))
            .where(eq(userTracks.userId, uid))
            .groupBy(
                artists.id,
                artists.spotifyId,
                artists.artistName,
                artists.imageUrl,
                artists.createdAt
            )
    );

    return db
        .with(sq)
        .select({
            id: sq.artistId,
            spotifyId: sq.spotifyId,
            artistName: sq.artistName,
            imageUrl: sq.imageUrl,
            createdAt: sq.createdAt,
            playCount: sq.playCount,
        })
        .from(sq)
        .orderBy(desc(sq.playCount))
        .limit(count);
};


export const getTopUserTracks = async (count: number = 20, uid: number): Promise<Omit<DetailedTrack, "playedAt">[]> => {
    const sq = db.$with("sq").as(
        db
            .select({
                id: tracks.id,
                spotifyId: tracks.spotifyId,
                trackName: tracks.trackName,
                albumId: tracks.albumId,
                durationMs: tracks.durationMs,
                imageUrl: tracks.imageUrl,
                createdAt: tracks.createdAt,
                yourPlaycount: sql<number>`COUNT(${userTracks.trackId})`.as("yourPlaycount")
            })
            .from(tracks)
            .innerJoin(userTracks, eq(userTracks.trackId, tracks.id))
            .where(eq(userTracks.userId, uid))
            .groupBy(tracks.id, tracks.spotifyId, tracks.trackName, tracks.albumId, tracks.durationMs, tracks.imageUrl, tracks.createdAt)
    );

    // @ts-ignore
    return db
        .with(sq)
        .select({
            id: sq.id,
            spotifyId: sq.spotifyId,
            trackName: sq.trackName,
            albumId: sq.albumId,
            durationMs: sq.durationMs,
            imageUrl: sq.imageUrl,
            createdAt: sq.createdAt,
            yourPlaycount: sq.yourPlaycount,
            artists: sql.raw(`
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', artists.id,
                    'spotifyId', artists.spotify_id,
                    'imageUrl', artists.image_url,
                    'artistName', artists.artist_name
                    'createdAt', artists.created_at,
                )
            )
        `).as("artists")
        })
        .from(sq)
        .leftJoin(artistTracks, eq(artistTracks.trackId, sq.id))
        .leftJoin(artists, eq(artistTracks.artistId, artists.id))
        .limit(count)
        .groupBy(sq.id, sq.spotifyId, sq.trackName, sq.albumId, sq.durationMs, sq.imageUrl, sq.createdAt, sq.yourPlaycount)
        .orderBy(desc(sq.yourPlaycount));
};

export async function getTrackById(trackId: number): Promise<Track | null> {
    return (await db.select().from(tracks).where(eq(tracks.id, trackId)))[0];
}

export async function getTrackBySpotifyId(spotifyId: string): Promise<Track | null> {
    return (await db.select().from(tracks).where(eq(tracks.spotifyId, spotifyId)))[0];
}

// TODO link artists
export async function createTrackIfNotExists(spotifyId: string): Promise<Track> {
    const localTrack = await getTrackBySpotifyId(spotifyId);
    if (localTrack) {
        return localTrack;
    }

    const trackData = await fetchSpotifyTrack(spotifyId);
    return (await db.insert(tracks).values(trackData).returning())[0]
}


export async function getDetailedById(tracKId: number): Promise<Omit<DetailedTrack, "playedAt"> | null> {
    return (await db
        .select({
            id: tracks.id,
            spotifyId: tracks.spotifyId,
            trackName: tracks.trackName,
            albumId: tracks.albumId,
            durationMs: tracks.durationMs,
            imageUrl: tracks.imageUrl,
            createdAt: tracks.createdAt,
            artists: sql.raw(`json_agg(json_build_object(
                'id', artists.id,
                'spotifyId', artists.spotify_id,
                'artistName', artists.artist_name,
                'imageUrl', artists.image_url,
                'createdAt', artists.created_at
            ))`).as("artists"),
        })
        .from(tracks)
        .innerJoin(artistTracks, eq(artistTracks.trackId, tracks.id))
        .innerJoin(artists, eq(artists.id, artistTracks.artistId))
        .where(eq(tracks.id, tracKId))
        .groupBy(tracks.id)
        .then(rows =>
            rows.map(row => ({
                ...row,
                artists: typeof row.artists === "string" ? JSON.parse(row.artists) : row.artists, // Ensure proper JSON parsing
            }))
        ))[0] || null;
}

export async function getTrackPlayCountForUser(uid: number, trackId: number): Promise<number | null> {
    return (await db
        .select({val: count()})
        .from(userTracks)
        .where(
            and(
                eq(userTracks.trackId, trackId),
                eq(userTracks.userId, uid))
        )
    )[0]?.val;
}


export async function getTrackPlayCount(trackId: number): Promise<number | null> {
    const result = await db
        .select({ val: count() })
        .from(userTracks)
        .innerJoin(users, eq(userTracks.userId, users.id))
        .innerJoin(tracks, eq(userTracks.trackId, tracks.id))
        .where(eq(tracks.id, trackId));

    return result[0]?.val ?? null;
}

export async function getGlobalPlaycount(): Promise<number> {
    return (await db
        .select({val: count()})
        .from(userTracks))[0].val;
}


// creates a track and links it with the given artist ids. requires the artists to actuall exist though
export async function createAndLinkTrack(artistIds: string[], track: NewTrack): Promise<Track> {
    const rettrack = (await db.insert(tracks)
        .values(track)
        .returning())[0];

    await linkArtistTracks(artistIds, rettrack.id);

    return rettrack;
}


export async function fetchSpotifyTrack(spotifyId: string): Promise<NewTrack> {
    const accessToken = await getSpotifyAppToken();

    try {
        const res = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`);
        const {duration_ms, name, album} = res.data;


        const insertAlbumData = {
            spotifyId: album.id,
            albumName: album.name,
            artistSpotifyId: album.artists[0].id,
            imageUrl: album.images[0]?.url || null,
            releaseDate: album.release_date,
            releaseDatePrecision: album.release_date_precision
        };

        // album in our db
        const localAlbum = await createAlbumIfNotExists(album.id, insertAlbumData);

        if (!localAlbum) {
            throw new TrackNotFoundException("Failed to create or fetch album data");
        }

        return {
            durationMs: duration_ms,
            spotifyId: spotifyId,
            trackName: name,
            albumId: localAlbum.id,
        }
    } catch (e: any) {
        if (e?.status === 404) {
            throw new TrackNotFoundException("Track does not exist");
        }

        if (e instanceof TrackNotFoundException) {
            throw e;
        }

        throw new Error("Failed to fetch track");
    }
}