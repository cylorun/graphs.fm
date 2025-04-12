"use client"




import {useEffect, useState} from "react";
import Container from "@/components/container";
import {DetailedTrack} from "@shared/types";
import api from "@/util/api";

export default function Page() {
    const [track, setTrack] = useState<DetailedTrack | null>(null);

    useEffect(() => {
        const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

        socket.addEventListener("open", (event) => {
            socket.send(JSON.stringify(
                {
                    type: "subscribe",
                    uid: 2
                }
            ));
        });

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
    }, []);

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            {track === null ? "no track" : track.trackName}
        </Container>
    )
}