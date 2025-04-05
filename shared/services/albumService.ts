import {Album, NewAlbum} from "../types";
import {db} from "../db";
import {albums} from "../drizzle/schema";
import {eq} from "drizzle-orm";


export async function getAlbumBySpotifyID(spotifyId: string): Promise<Album | null> {
    const album = (await db
        .select()
        .from(albums)
        .where(eq(albums.spotifyId, spotifyId)))[0];

    if (!album) return null;

    return album;
}

export async function createAlbum(data: NewAlbum): Promise<Album | null> {
     return (await db.insert(albums)
        .values(data)
        .returning())[0];

}