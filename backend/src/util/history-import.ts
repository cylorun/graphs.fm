import {getAllDirectoryFiles} from "./util";
import * as fs from "node:fs";
import {NewTrack} from "@/shared/types";
import {getAlbumBySpotifyID} from "@/shared/services/albumService";
import {getTrackById} from "../controllers/api/trackApiController";
import {createTrackIfNotExists, getTrackBySpotifyId} from "@/shared/services/trackService";

function getHistoryTrackId(historyTrackObj: any): string | null {
    const spotifyUriSplit = historyTrackObj.spotify_track_uri.split(':');
    if (spotifyUriSplit.length !== 3) {
        return null;
    }

    return spotifyUriSplit[2]; // last item is the Id
}

// should only be called if the track doesnt already exist
async function getNewTrackFromHistory(historyTrackObj: any): Promise<NewTrack> {
    const spotifyId = getHistoryTrackId(historyTrackObj);
    if (!spotifyId) {
        throw new Error("Failed to get track id");
    }

    const localTrack = await createTrackIfNotExists(spotifyId);


    return localTrack;
}

export function importUserHistory(unzippedPath: string) {
    const files = getAllDirectoryFiles(unzippedPath);
    files
        .filter(f => f.endsWith(".json") && f.includes("Streaming_History_Audio")) // only include audio not video (aka episodes and shit)
        .forEach(filepath => {
            const fileObj = JSON.parse(fs.readFileSync(filepath, "utf8"));
            if (Array.isArray(fileObj)) { // the root of the object should always be a list

            }
        }
    );
}