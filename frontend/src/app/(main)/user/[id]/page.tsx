'use client'

import React from "react";
import Container from "@/components/container";
import UserNav, { UserNavSkeleton } from "@/components/user-nav";
import RecentUserTracks, { RecentUserTracksSkeleton } from "@/components/recent-user-tracks";
import { ListeningClock } from "@/components/listening-clock";
import UserPageLayout from "@/components/user-page-layout";

export type PageProps = {
    params: Promise<{ id: string }>
};

const PageSkeleton = () => (
    <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
        <UserNavSkeleton />
        <RecentUserTracksSkeleton rows={15} />
    </Container>
);

export function Page({ params }: { params: { id: string } }) {
    const uid = params.id;

    return (
        <UserPageLayout uid={uid} tab="overview">
            <h2 className="border-b border-b-gray-400 mt-8">Recent activity</h2>
            <div className="flex flex-col md:flex-row">
                <RecentUserTracks uid={uid} />
                <div className="mr-8">
                    <h2 className="text-center mt-4">Listening clock</h2>
                    <ListeningClock uid={uid} />
                </div>
            </div>
        </UserPageLayout>
    );
}
export default Page;
