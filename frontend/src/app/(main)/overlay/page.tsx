"use client"




import {useEffect, useState} from "react";
import Container from "@/components/container";
import {redirect} from "next/navigation";
import {ListeningOverlay, ListeningOverlayProps} from "@/components/listening-overlay";
import api from "@/util/api";
import {useSession} from "@/context/session-context";

export default function Page() {
    const [overlayData, setOverlayData] = useState<ListeningOverlayProps>({ uid: 2 })
    const {user} = useSession();

    useEffect(() => {
        if (!user) return;
        setOverlayData(old => {
            return {...old, uid: user.id};
        });
    }, [user]);

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <ListeningOverlay data={overlayData}/>
        </Container>
    )
}