import axios from 'axios';
import {refreshAccessToken} from '../util/tokenManager';
import {db} from "../db";
import {albums, artists, artistTracks, tracks, users} from "../drizzle/schema";
import {eq} from "drizzle-orm";
import {Artist, DetailedTrack, NewAlbum, NewTrack, UserNotFoundException} from '../types';
import {createArtist, createArtistsIfNotExists, getArtistBySpotifyId} from "./artistService";
import {createAlbum, createAlbumIfNotExists, getAlbumBySpotifyID} from "./albumService";
import {parseReleaseDate} from "../util/util";
import {logger} from "../util/logger";
import {createAndLinkTrack} from "./trackService";

export const getAccessToken = async (uid: number) => {
    const user = (await db.select({accessToken: users.accessToken})
        .from(users)
        .where(eq(users.id, uid)))[0];

    if (!user) {
        return null;
    }

    return user.accessToken;
};


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

        if (response.data.currently_playing_type !== 'track' || !response.data.is_playing) {
            return null;
        }

        const item = response.data.item;
        if (!item || item.type !== "track") {
            return null;
        }

        const artistIds = item.artists.map((a: any) => a.id);

        const trackData: Omit<NewTrack, "albumId"> = {
            spotifyId: item.id,
            trackName: item.name,
            durationMs: item.duration_ms,
            imageUrl: item.album.images[0]?.url || null,
        };

        const existingTrack = await db
            .select()
            .from(tracks)
            .where(eq(tracks.spotifyId, trackData.spotifyId))
            .limit(1);

        let track = existingTrack.length > 0 ? existingTrack[0] : null;

        if (!track) {
            // link artists and genres
            await createArtistsIfNotExists(artistIds, accessToken);

            const albumItemData = item.album;
            const albumData = {
                spotifyId: albumItemData.id,
                albumName: albumItemData.name,
                artistSpotifyId: albumItemData.artists[0].id,
                imageUrl: albumItemData.images[0]?.url || null,
                releaseDate: albumItemData.release_date,
                releaseDatePrecision: albumItemData.release_date_precision
            };


            const album = await createAlbumIfNotExists(albumItemData.id, albumData);
            if (!album) {
                logger.error("Failed to register album :/");
                return null;
            }

           track = await createAndLinkTrack(artistIds, {...trackData, albumId: album.id});
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
        logger.warn(`Failed to fetch current track for: ${uid}\\nMessage: ${error.message}`);

        if (error.response?.status === 401 && failedAttempts <= 1) {
            await refreshAccessToken(uid);
            return getCurrentlyPlaying(uid, failedAttempts + 1);
        }
        throw error;
    }
};
