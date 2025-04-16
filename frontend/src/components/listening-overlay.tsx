"use client"

import {useEffect, useState} from "react";
import {DetailedTrack} from "@shared/types";
import api from "@/util/api";

export type ListeningOverlayProps = {
    uid: number;
}

export function ListeningOverlay({data}: { data: ListeningOverlayProps }) {
    const [track, setTrack] = useState<DetailedTrack | null>(null);

    useEffect(() => {
        if (!data.uid || data.uid === -1) return;
        const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

        socket.addEventListener("open", () => {
            if (data.uid !== -1) {
                socket.send(JSON.stringify({
                    type: "subscribe",
                    uid: data.uid
                }));
            }
        });

        socket.addEventListener("message", async (event) => {
            try {
                const {trackId} = JSON.parse(event.data);
                console.log("update:", trackId);

                const res = await api.get(`/tracks/${trackId}`);
                setTrack(res.data);
            } catch (e) {
                console.error("Failed to parse update", e);
            }
        });

        // return () => {
        //     socket.close();
        // };
    }, [data.uid]);


    return (
        <div className="flex items-center gap-4 bg-gray-950 border border-gray-700  p-4 rounded-2xl  max-w-md w-full">
            <img
                src={track?.imageUrl || "/placeholder-track.png"}
                alt={track?.trackName}
                className="w-16 h-16 rounded-lg object-cover shadow"
            />

            <div className="flex flex-col overflow-hidden">
                <span className="text-sm text-gray-400">Now Playing</span>
                <span className="text-lg text-gray-300 font-semibold truncate">{track?.trackName || "No track playing"}</span>
                <span className="text-sm text-gray-500 truncate">{track?.artists.map(a => a.artistName).join(',') || ""}</span>
            </div>
        </div>
    );

}