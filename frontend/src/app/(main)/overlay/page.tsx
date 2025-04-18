"use client"




import {useEffect, useState} from "react";
import Container from "@/components/container";
import {redirect} from "next/navigation";
import {ListeningOverlay, ListeningOverlayProps} from "@/components/listening-overlay";
import api from "@/util/api";

export default function Page() {
    const [overlayData, setOverlayData] = useState<ListeningOverlayProps>({ uid: 2 })

    useEffect(() => {
        const fetchUid = async () => {
            try {
                const res = await api.get('/users');
                setOverlayData(old => {
                    return {...old, uid: res.data.uid};
                });
            } catch (e: any) {
                if (e.status === 403 || e.status === 401) {
                    redirect('/login');
                }
            }
        }

        fetchUid();
    }, []);

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <ListeningOverlay data={overlayData}/>
        </Container>
    )
}