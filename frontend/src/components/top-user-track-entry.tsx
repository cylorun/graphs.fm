import Link from "next/link";
import React from "react";
import {Album, DetailedTrack} from "@shared/types";

export type TopUserTrackEntryProps = {
    track: Omit<DetailedTrack & {playCount: number, album: Album}, "playedAt">;
    idx: number;
}

export function TopUserTrackEntry({track, idx}: TopUserTrackEntryProps) {
    return (
        <div
            key={track.id}
            className="flex items-center justify-between gap-4 bg-card-background hover:bg-active-card-background transition-colors p-4 rounded-xl"
        >
            <div className="flex items-center gap-4">
                <span className="text-green-400 font-bold w-6">{idx + 1}</span>
                <img
                    src={track.imageUrl || "/placeholder-track.png"}
                    alt={track.trackName}
                    className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                    <Link
                        href={`/track/${track.id}`}
                        className="text-white font-semibold hover:underline"
                    >
                        {track.trackName}
                    </Link>
                    <p className="text-foreground-muted  text-sm">{track.album.albumName}</p>
                    <p className="text-gray-500 text-xs">
                        {track.artists.map((a, i) => (
                            <React.Fragment key={a.id}>
                                {i > 0 && ', '}
                                <Link href={`/artist/${a.id}`} className="hover:underline text-green-400">
                                    {a.artistName}
                                </Link>
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
            <span className="text-sm text-foreground-muted ">{track.playCount} plays</span>
        </div>
    )
}