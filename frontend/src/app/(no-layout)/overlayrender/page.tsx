'use client'

import {ListeningOverlay} from "@/components/listening-overlay";
import {useSearchParams} from "next/navigation";


export default function Page() {
    const searchParams = useSearchParams();
    const data = {
        uid: parseInt(searchParams.get('uid') || '0')
    }

    return (
        <ListeningOverlay data={data}/>
    )
}