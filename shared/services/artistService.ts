import {Artist, Genre, NewArtist} from "../types";
import {db} from "../db";
import {artistGenres, artists, artistTracks, genres, tracks, userTracks} from "../drizzle/schema";
import {desc, eq, sql} from "drizzle-orm";
import axios from "axios";
import {logger} from "../util/logger";


export async function getArtistBySpotifyId(spotifyId: string): Promise<Artist | null> {
    const artist = (await db
        .select()
        .from(artists)
        .where(eq(artists.spotifyId, spotifyId)))[0];

    if (!artist) return null;

    return artist;
}

export async function getArtistById(aid: number): Promise<Artist | null> {
    const artist = (await db
        .select()
        .from(artists)
        .where(eq(artists.id, aid)))[0];

    if (!artist) return null;

    return artist;
}

export async function getArtistGenres(artistId: number): Promise<Genre[] | null> {
    const result = await db
        .select({ id: genres.id, genreName: genres.genreName, createdAt: genres.createdAt })
        .from(artistGenres)
        .innerJoin(genres, eq(artistGenres.genreId, genres.id))
        .where(eq(artistGenres.artistId, artistId));

    return result.length > 0 ? result : [];
}

export async function createArtist(artist: NewArtist, genreNames: string[]): Promise<Artist> {
    return await db.transaction(async (tx) => {
        const insertedArtist = await tx.insert(artists).values(artist).returning();
        const artistId = insertedArtist[0].id;

        const genreRecords = await Promise.all(genreNames.map(async (genreName) => {
            const existingGenre = await tx.select().from(genres).where(eq(genres.genreName, genreName)).limit(1);
            if (existingGenre.length > 0) {
                return existingGenre[0].id;
            } else {
                const newGenre = await tx.insert(genres).values({ genreName }).returning();
                return newGenre[0].id;
            }
        }));

        if (genreRecords.length > 0) {
            await tx.insert(artistGenres).values(
                genreRecords.map((genreId) => ({ artistId, genreId }))
            );
        }

        return insertedArtist[0] || null;
    });
}

export const getTopArtists = async (count: number = 20): Promise<Artist[]> => {
    return db
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


export async function createArtistsIfNotExists(ids: string[], accessToken: string) {
    for (const id of ids) {
        const artist = await getArtistBySpotifyId(id);
        if (!artist) {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });

            if (response.status === 200) {
                const {genres, images, name} = response.data;

                const imageUrl = images[0]?.url;
                await createArtist({
                    spotifyId: id,
                    artistName: name,
                    imageUrl: imageUrl
                }, genres);
            } else {
                logger.error("Failed to fetch artist data: " +  response.data);
            }
        }
    }
}


// link a list of artists to a given track
export async function linkArtistTracks(artistIds: string[], trackId: number){
    for (let id of artistIds) {
        const artist = await getArtistBySpotifyId(id);
        if (artist) { // it should always exist, since `createArtistIfNotExists` should always be called before
            await db.insert(artistTracks).values({artistId: artist.id, trackId: trackId});
        }
    }
}
