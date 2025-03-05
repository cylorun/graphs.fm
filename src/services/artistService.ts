import {Artist, Genre, NewArtist} from "../types";
import {db} from "../db";
import {artistGenres, artists, genres} from "../db/schema";
import {eq} from "drizzle-orm";


export async function getArtistBySpotifyId(spotifyId: string): Promise<Artist | null> {
    const artist = (await db
        .select()
        .from(artists)
        .where(eq(artists.spotifyId, spotifyId)))[0];

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

export async function createArtist(artist: NewArtist): Promise<Artist> {
    return (await db.insert(artists).values(artist).returning())[0];
}