"use client"

import {useEffect, useState} from "react";
import Container from "@/components/container";
import {DetailedTrack} from "@shared/types";
import api from "@/util/api";

export type ListeningOverlayProps = {
    uid: number;
}

export  function ListeningOverlay({data}: {data: ListeningOverlayProps }) {
        const [track, setTrack] = useState<DetailedTrack | null>(null);

        useEffect(() => {
            const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

            // socket.addEventListener("open", (event) => {
            // });

            socket.addEventListener("message", (event) => {
                (async () => {
                    try {
                        const {trackId} = JSON.parse(event.data);
                        console.log("update:", trackId);

                        const res = await api.get(`/tracks/${trackId}`);
                        setTrack(res.data);

                    } catch (e) {
                        console.error("Failed to parse update");
                    }
                })();
            });

            if (data.uid !== -1 && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(
                    {
                        type: "subscribe",
                        uid: data.uid
                    }
                ));
            }

        }, [data.uid]);

        return (
            <div className="border-2 border-gray-200 w-fit p-4 rounded-lg">
                {track?.trackName || "No track playing"}
            </div>
        )

}