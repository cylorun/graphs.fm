'use client'

import {ListeningOverlay} from "@/components/listening-overlay";
import {useSearchParams} from "next/navigation";


export default function Page() {
    const searchParams = useSearchParams();
    const data = {
        uid: parseInt(searchParams.get('uid') || '-1')
    }


    if (data.uid === -1) {
        return (
            <h1>no uid provided</h1>
        )
    }

    return (
        <ListeningOverlay data={data}/>
    )
}