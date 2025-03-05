import axios from 'axios';
import {refreshAccessToken} from '../util/tokenManager';
import {db} from "../db";
import {artistTracks, tracks, users} from "../db/schema";
import {eq} from "drizzle-orm";
import {NewTrack, Track} from '../types';
import {createArtist, getArtistBySpotifyId} from "./artistService";

export const getAccessToken = async (uid: number) => {
    const user = (await db.select({accessToken: users.accessToken})
        .from(users)
        .where(eq(users.id, uid)))[0];

    if (!user) {
        return null;
    }

    return user.accessToken;
};

const createArtistIfNotExists = async (ids: string[], accessToken: string) => {
    for (const id of ids) {
        const artist = await getArtistBySpotifyId(id);
        if (!artist) {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });

            if (response.status === 200) {
                const {genres, images, name} = response.data;

                console.log("Registering new artist:", response.data);
                const imageUrl = images[0]?.url;
                await createArtist({
                    spotifyId: id,
                    artistName: name,
                    imageUrl: imageUrl
                }, genres);
            }
        }
    }
}

const linkArtistTracks = async (artistIds: string[], trackId: number) => {
    for (let id of artistIds) {
        const artist = await getArtistBySpotifyId(id);
        if (artist) { // it should always exist, since `createArtistIfNotExists` should always be called before
            await db.insert(artistTracks).values({artistId: artist.id, trackId: trackId});
        }
    }
}

export const getCurrentlyPlaying = async (uid: number, failedAttempts: number = 0): Promise<Track | null> => {
    const accessToken = await getAccessToken(uid);
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        if (response.status === 204) {
            return null;
        }

        const artistIds = response.data.item.artists.map((a: any) => a.id);

        const trackData: NewTrack = {
            spotifyId: response.data.item.id,
            trackName: response.data.item.name,
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

        const insertedTrack = (await db.insert(tracks)
            .values(trackData)
            .returning())[0];

        console.log("Registered new track:", insertedTrack.trackName);

        await createArtistIfNotExists(artistIds, accessToken);
        await linkArtistTracks(artistIds, insertedTrack.id)

        return insertedTrack
    } catch (error: any) {
        if (error.response?.status === 401 && failedAttempts <= 1) {
            await refreshAccessToken(uid);
            return getCurrentlyPlaying(uid, failedAttempts++);
        }
        throw error;
    }
};