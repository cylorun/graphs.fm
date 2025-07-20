import Link from "next/link";
import React from "react";
import {Artist} from "@shared/types";

export type TopUserArtistEntryProps = {
    artist: Omit<Artist & {playCount: number}, "playedAt">;
    idx: number;
}

export function TopUserArtistEntry({artist, idx}: TopUserArtistEntryProps) {
    return (
        <div
            key={artist.id}
            className="flex items-center justify-between gap-4 bg-card-background hover:bg-active-card-background transition-colors p-4 rounded-xl"
        >
            <div className="flex items-center gap-4">
                <span className="text-green-400 font-bold w-6">{idx + 1}</span>
                <img
                    src={artist.imageUrl || "/placeholder-track.png"}
                    alt={artist.artistName}
                    className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                    <a
                        href={`/artist/${artist.id}`}
                        className="text-white font-semibold hover:underline"
                    >
                        {artist.artistName}
                    </a>
                    {/*<p className="text-foreground-muted  text-sm">{artist.id}</p>*/}
                    <p className="text-gray-500 text-xs">
                        {/*{artist.artists.map((a, i) => (*/}
                        {/*    <React.Fragment key={a.id}>*/}
                        {/*        {i > 0 && ', '}*/}
                        {/*        <Link href={`/artist/${a.id}`} className="hover:underline text-green-400">*/}
                        {/*            {a.artistName}*/}
                        {/*        </Link>*/}
                        {/*    </React.Fragment>*/}
                        {/*))}*/}
                    </p>
                </div>
            </div>
            <span className="text-sm text-foreground-muted ">{artist.playCount} plays</span>
        </div>
    )
}