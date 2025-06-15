"use client"

import { useEffect, useRef, useState } from "react";
import { DetailedTrack } from "@shared/types";
import api from "@/util/api";

export type ListeningOverlayProps = {
    uid: number;
};

export function ListeningOverlay({ data }: { data: ListeningOverlayProps }) {
    const [track, setTrack] = useState<DetailedTrack | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const retryTimeout = useRef<NodeJS.Timeout | null>(null);

    const connectWebSocket = () => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
        if (!wsUrl || !data.uid || data.uid === -1) return;

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({
                type: "subscribe",
                uid: data.uid
            }));
        });

        socket.addEventListener("message", async (event) => {
            try {
                const { trackId } = JSON.parse(event.data);
                console.log("update:", trackId);
                const res = await api.get(`/tracks/${trackId}`);
                setTrack(res.data);
            } catch (e) {
                console.error("Failed to parse update", e);
            }
        });

        socket.addEventListener("close", () => {
            console.warn("WebSocket closed, retrying in 3s...");
            retryTimeout.current = setTimeout(connectWebSocket, 3000);
        });

        socket.addEventListener("error", () => {
            console.error("WebSocket error, closing connection...");
            socket.close();
        });
    };

    useEffect(() => {
        connectWebSocket();

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                    console.log("Tab active, reconnecting WebSocket...");
                    connectWebSocket();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            socketRef.current?.close();
            if (retryTimeout.current) clearTimeout(retryTimeout.current);
        };
    }, [data.uid]);

    return (
        <div className="flex items-center gap-4 bg-gray-950 border border-gray-700 p-4 rounded-2xl max-w-md w-full">
            <img
                src={track?.imageUrl || "/placeholder-track.png"}
                alt={track?.trackName}
                className="w-16 h-16 rounded-lg object-cover shadow"
            />

            <div className="flex flex-col overflow-hidden">
                <span className="text-sm text-gray-400">Now Playing</span>
                <span className="text-lg text-gray-300 font-semibold truncate">{track?.trackName || "No track playing"}</span>
                <span className="text-sm text-gray-500 truncate">
                    {track?.artists.map(a => a.artistName).join(',') || ""}
                </span>
            </div>
        </div>
    );
}
