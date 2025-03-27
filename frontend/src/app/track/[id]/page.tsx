'use client'
import React, {useEffect, useState} from "react";
import Container from "@/components/container";
import UserNav, {UserNavSkeleton} from "@/components/user-nav";
import RecentUserTracks, {RecentUserTracksSkeleton} from "@/components/recent-user-tracks";
import api from "@/util/api";
import {DetailedTrack, PublicUser, TrackNotFoundException, UserNotFoundException} from "@shared/types";

export type PageProps = {
    params: Promise<{ id: string }>
}

const PageSkeleton = () => {
    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">

        </Container>
    )
}

const Page = ({params}: PageProps) => {
    const [trackId, setTrackId] = useState<string>(); // username or uid
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(false);
    const [track, setTrack] = useState<DetailedTrack | null>(null);


    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await params;
            setTrackId(unwrappedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchTrackData = async () => {
            if (!trackId) return;
            setLoading(true);

            try {
                const res = await api.get(`/tracks/${trackId}`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setTrack({
                        ...res.data,
                        createdAt: new Date(res.data.createdAt),
                        lastLogin: new Date(res.data.lastLogin)
                    });
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new TrackNotFoundException("User not found"));
                    return;
                }
                setError(new Error("Failed to fetch user data: " + e.status));
            } finally {
                setLoading(false);
            }
        };

        fetchTrackData();
    }, [trackId]);

    if (error instanceof TrackNotFoundException) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                User not found
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                Something went wrong
            </Container>
        )
    }

    if (loading || !track) {
        return <PageSkeleton/>
    }

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <h2>Track: {track.trackName}</h2>
        </Container>
    );
}

export default Page;