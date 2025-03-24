import {Genre} from "../types";

export async function getTopUserGenres(uid: number): Promise<(Omit<Genre, "createdAt"> & {playCount: number})[]> {
    return [
        {
            id: 1,
            genreName: "Rock",
            playCount: 2
        }
    ]
}