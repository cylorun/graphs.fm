import axios from 'axios';
import { refreshAccessToken } from '../util/tokenManager';
import { db } from "../db";
import {users, tracks, userTracks} from "../db/schema";
import {desc, eq} from "drizzle-orm";
import {NewTrack, Track} from '../types';

export const getAccessToken = async (uid: number) => {
    const user = (await db.select({ accessToken: users.accessToken })
        .from(users)
        .where(eq(users.id, uid)))[0];

    if (!user) {
        return null;
    }

    return user.accessToken;
};

export const getCurrentlyPlaying = async (uid: number, failedAttempts: number = 0): Promise<Track | null> => {
    const accessToken = await getAccessToken(uid);
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status === 204) {
            return null;
        }

        const trackData: NewTrack = {
            spotifyId: response.data.item.id,
            trackName: response.data.item.name,
            artist: response.data.item.artists.map((a: any) => a.name).join(','),
            album: response.data.item.album.name,
            durationMs: response.data.item.duration_ms,
            imageUrl: response.data.item.album.images[0]?.url || null,
        };

        // check if the track exists in our db
        const existingTrack = await db
            .select()
            .from(tracks)
            .where(eq(tracks.spotifyId, trackData.spotifyId))
            .limit(1);

        // return it if it does, else create it
        if (existingTrack.length > 0) {
            return existingTrack[0];
        }

        const insertedTrack = await db.insert(tracks)
            .values(trackData)
            .returning();

        return insertedTrack[0]
    } catch (error: any) {
        if (error.response?.status === 401 && failedAttempts <= 1)  {
            await refreshAccessToken(uid);
            return getCurrentlyPlaying(uid, failedAttempts++);
        }
        throw error;
    }
};