'use client'
import React, {useEffect, useState} from "react";
import Container from "@/components/container";
import UserNav from "@/components/user-nav";
import RecentUserTracks from "@/components/recent-user-tracks";

export type PageProps = {
    params: Promise<{ id: string }>
}

const Page = ({params}: PageProps) => {
    const [uid, setUid] = useState<string>(); // username or uid
    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await params;
            setUid(unwrappedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchUserData = async () => {

        }
        fetchUserData();
    }, [uid]);

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNav className={'border-b-gray-700'} uid={uid} tab={'overview'} />
            <h2 className={'border-b border-b-gray-400 mt-8'}>Recent activity</h2>
            <RecentUserTracks uid={uid} />
        </Container>
    );
}

export default Page;