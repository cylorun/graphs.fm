import {db} from "../db";
import {Genre} from "../types";
import {getTopArtists} from "./artistService";

export async function getTopUserGenres(uid: number): Promise<(Omit<Genre, "createdAt"> & {playCount: number})[]> {
    return [
        {
            id: 1,
            genreName: "Rock",
            playCount: 2
        }
    ]
}