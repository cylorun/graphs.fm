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

export async function createArtist(artist: NewArtist, genreNames: string[]): Promise<Artist> {
    return await db.transaction(async (tx) => {
        console.log("Creating artist service")
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

        console.log(genreRecords);

        await tx.insert(artistGenres).values(
            genreRecords.map((genreId) => ({ artistId, genreId }))
        );

        return insertedArtist[0];
    });
}
