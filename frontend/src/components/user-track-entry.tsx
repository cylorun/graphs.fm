import { DetailedTrack } from "@shared/types";
import moment from "moment";
import { cn } from "@/util/utils";
import React from "react";

export type UserTrackEntryProps = {
    track: DetailedTrack;
    isActive?: boolean; // is currently listening
};

export const UserTrackEntrySkeleton = () => {
    return (
        <div className="flex justify-between items-center gap-4 bg-[#121212] p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-700"></div>
                <div className="flex flex-col gap-1">
                    <div className="w-28 h-5 bg-gray-700 rounded"></div>
                    <div className="w-20 h-4 bg-gray-800 rounded"></div>
                </div>
            </div>
            <div className="w-16 h-4 bg-gray-700 rounded"></div>
        </div>
    );
};

const UserTrackEntry = ({ track, isActive = false }: UserTrackEntryProps) => {
    return (
        <div
            className={cn(
                "flex justify-between items-center gap-4 p-4 rounded-xl transition-all duration-300",
                isActive
                    ? "bg-[#1DB954]/20 border border-primary shadow-md" // bg shit is literally just primary but tailwind moment
                    : "bg-card-background hover:bg-active-card-background"
            )}
        >
            {/* left section - album cover & info */}
            <div className="flex items-center gap-4">
                <img
                    src={track.imageUrl || "/placeholder-track.png"}
                    alt={track.trackName}
                    className="w-14 h-14 rounded-lg object-cover shadow-md"
                />
                <div className="flex flex-col">
                    <a
                        className="text-white font-semibold text-lg hover:text-primary transition-colors"
                        href={`/track/${track.id}`}
                    >
                        {track.trackName}
                    </a>
                    <p className="text-foreground-muted text-sm hover:text-white transition-colors">
                        {track.artists.map((a, index) => (
                            <React.Fragment key={a.id}>
                                {index > 0 && ", "}
                                <a href={`/artist/${a.id}`} className="hover:underline">
                                    {a.artistName}
                                </a>
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>

            {/* Right Section - Playback Info */}
            <div className="text-right">
                <p
                    className={cn(
                        "text-sm",
                        isActive
                            ? "text-primary font-semibold animate-pulse"
                            : "text-foreground-muted "
                    )}
                >
                    {isActive ? "Now Playing" : moment(track?.playedAt).fromNow()}
                </p>
            </div>
        </div>
    );
};

export default UserTrackEntry;
