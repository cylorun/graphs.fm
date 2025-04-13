"use client"




import {useEffect, useState} from "react";
import Container from "@/components/container";
import {useSearchParams} from "next/navigation";
import {ListeningOverlay, ListeningOverlayProps} from "@/components/listening-overlay";

export default function Page() {
    const searchParams = useSearchParams();
    const [overlayData, setOverlayData] = useState<ListeningOverlayProps>({ uid: -1 })

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <ListeningOverlay data={overlayData}/>
        </Container>
    )
}