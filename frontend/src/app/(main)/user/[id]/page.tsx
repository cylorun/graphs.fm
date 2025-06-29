'use client'

import React, {useEffect, useMemo, useState} from "react";
import Container from "@/components/container";
import UserNav, { UserNavSkeleton } from "@/components/user-nav";
import RecentUserTracks, { RecentUserTracksSkeleton } from "@/components/recent-user-tracks";
import { PublicUser, UserNotFoundException } from "@shared/types";
import { ListeningClock } from "@/components/listening-clock";
import {API_BASE_URL, useApi} from "@/hooks/useApi";

export type PageProps = {
    params: Promise<{ id: string }>
};

const PageSkeleton = () => (
    <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
        <UserNavSkeleton />
        <RecentUserTracksSkeleton rows={15} />
    </Container>
);

const Page = ({ params }: PageProps) => {
    const [uid, setUid] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrapped = await params;
            setUid(unwrapped.id);
        };
        unwrapParams();
    }, [params]);

    const {
        status: userStatus,
        statusCode: userStatusCode,
        data: user
    } = useApi<PublicUser>(uid ? `/users/${uid}` : '', {
        method: 'GET'
    });


    const transformedUser = useMemo(() => {
        if (!user) return null;
        return {
            ...user,
            createdAt: new Date(user.createdAt),
        };
    }, [user]);

    // Send user's timezone once uid is loaded
    useEffect(() => {
        const updateUserTimezone = async () => {
            if (!uid) return;

            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                await fetch(`${API_BASE_URL}/users/set-timezone`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ timezone: timeZone })
                });
            } catch (e) {
                console.error("Failed to update timezone", e);
            }
        };

        updateUserTimezone();
    }, [uid]);

    useEffect(() => {
        if (userStatus === "error" && userStatusCode === 404) {
            setError(new UserNotFoundException("User not found"));
        } else if (userStatus === "error") {
            setError(new Error("Failed to fetch user"));
        }
    }, [userStatus, userStatusCode]);

    if (error instanceof UserNotFoundException) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                User not found
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                Something went wrong
            </Container>
        );
    }

    if (userStatus === 'loading' || !transformedUser) {
        return <PageSkeleton />;
    }

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNav className={'border-b-gray-700'} user={transformedUser} tab={'overview'} />
            <h2 className={'border-b border-b-gray-400 mt-8'}>Recent activity</h2>
            <div className={'flex flex-col md:flex-row'}>
                <RecentUserTracks uid={uid!} />
                <div className={'mr-8'}>
                    <h2 className={'text-center mt-4'}>Listenixng clock</h2>
                    <ListeningClock uid={transformedUser.username} />
                </div>
            </div>
        </Container>
    );
};

export default Page;
