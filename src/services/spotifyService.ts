import axios from 'axios';
import {refreshAccessToken} from '../util/tokenManager';
import {db} from "../db";
import {artists, artistTracks, tracks, users} from "../db/schema";
import {eq} from "drizzle-orm";
import {DetailedTrack, NewTrack, UserNotFoundException} from '../types';
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

                console.log("Registering new artist:", response.data.name);
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

export const getCurrentlyPlaying = async (uid: number, failedAttempts: number = 0): Promise<DetailedTrack | null> => {
    const accessToken = await getAccessToken(uid);
    if (!accessToken) {
        throw new UserNotFoundException("Access token not found");
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // if nothing is playing
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

        const existingTrack = await db
            .select()
            .from(tracks)
            .where(eq(tracks.spotifyId, trackData.spotifyId))
            .limit(1);

        let track = existingTrack.length > 0 ? existingTrack[0] : null;

        if (!track) {
            // create the new track
            track = (await db.insert(tracks)
                .values(trackData)
                .returning())[0];

            console.log("Registered new track:", track.trackName);

            // link artists and genres
            await createArtistIfNotExists(artistIds, accessToken);
            await linkArtistTracks(artistIds, track.id);
        }


        const artistsData = (await db
            .select({artists})
            .from(artists)
            .innerJoin(artistTracks, eq(artistTracks.artistId, artists.id))
            .where(eq(artistTracks.trackId, track.id))).map(a => a.artists);


        return {
            ...track,
            playedAt: new Date(),
            artists: artistsData,
        };
    } catch (error: any) {
        console.error("failed to fetch current track");
        console.dir(error.response);

        if (error.response?.status === 401 && failedAttempts <= 1) {
            console.log("Reloading access token");
            await refreshAccessToken(uid);
            return getCurrentlyPlaying(uid, failedAttempts + 1);
        }
        throw error;
    }
};
