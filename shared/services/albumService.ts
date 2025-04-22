import {Album, NewAlbum} from "../types";
import {db} from "../db";
import {albums} from "../drizzle/schema";
import {eq} from "drizzle-orm";
import {getArtistBySpotifyId} from "./artistService";
import {logger} from "../util/logger";


export async function getAlbumBySpotifyID(spotifyId: string): Promise<Album | null> {
    const album = (await db
        .select()
        .from(albums)
        .where(eq(albums.spotifyId, spotifyId)))[0];

    if (!album) return null;

    return album;
}

export async function getAlbumById(id: number): Promise<Album | null> {
    const album = (await db
        .select()
        .from(albums)
        .where(eq(albums.id, id)))[0];

    if (!album) return null;

    return album;
}

export async function createAlbum(data: NewAlbum): Promise<Album | null> {
     return (await db.insert(albums)
        .values(data)
        .returning())[0];

}



export async function createAlbumIfNotExists (albumId: string, data: Omit<NewAlbum, "artistId"> & {artistSpotifyId: string}) {
    const album = await getAlbumBySpotifyID(albumId);
    if (!album) {
        const artist = await getArtistBySpotifyId(data.artistSpotifyId);
        if (!artist) {
            logger.error("Failed to fetch artist data whilst registering album with id:" + albumId);
            return null;
        }

        return await createAlbum({...data, artistId: artist.id});
    }

    return album;
}