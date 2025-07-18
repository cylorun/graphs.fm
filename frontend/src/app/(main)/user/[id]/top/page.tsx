'use client'
import React, {useEffect, useMemo, useState} from "react";
import Container from "@/components/container";
import UserNav, { UserNavSkeleton } from "@/components/user-nav";
import {Artist, DetailedTrack, PublicUser, UserNotFoundException} from "@shared/types";
import {TopUserTrackEntry} from "@/components/top-user-track-entry";
import {TopUserArtistEntry} from "@/components/top-user-artist-entry";
import {useUnwrappedParams} from "@/hooks/useUnwrappedParams";
import {useApi} from "@/hooks/useApi";

export type PageProps = {
    params: Promise<{ id: string }>
};

const PageSkeleton = () => (
    <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
        <UserNavSkeleton />
        <div className="mt-8 space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800 h-20 rounded-xl"></div>
            ))}
        </div>
    </Container>
);


const Page = ({ params }: PageProps) => {
    const {id: uid} = useUnwrappedParams(params, ['id']) || {};
    const [error, setError] = useState<Error>();

    const {
        status: userStatus,
        statusCode: userStatusCode,
        data: user
    } = useApi<PublicUser>(uid ? `/users/${uid}` : '', {
        method: 'GET'
    });

    const {
        status: artistStatus,
        statusCode: artistStatusCode,
        data: topArtists
    } = useApi<(Artist & {playCount: number})[]>(uid ? `/users/${uid}/artists/top` : '', {
        method: 'GET'
    });

    const {
        status: tracksStatus,
        statusCode: tracksStatusCode,
        data: topTracks
    } = useApi<Omit<DetailedTrack & {playCount: number}, "playedAt">[]>(uid ? `/users/${uid}/tracks/top` : '', {
        method: 'GET'
    });

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
                <p className="text-red-400">User not found</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                <p className="text-red-400">Something went wrong</p>
            </Container>
        );
    }

    if (!user) {
        return <PageSkeleton />;
    }

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNav className="border-b-gray-700" user={user} tab="top" />

            <main className="flex flex-col md:flex-row gap-10 w-full mt-8">
                {/* Top Tracks */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
                        Top Tracks
                    </h2>

                    <div className="mt-6 space-y-3">
                        {topTracks?.length === 0 ? (
                            <p className="text-foreground-muted">No tracks found</p>
                        ) : (
                            topTracks?.map((track, index) => (
                                <TopUserTrackEntry track={track} idx={index} key={index} />
                            ))
                        )}
                    </div>
                </div>

                {/* Top Artists */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
                        Top Artists
                    </h2>

                    <div className="mt-6 space-y-3">
                        {topArtists?.length === 0 ? (
                            <p className="text-foreground-muted">No artists found</p>
                        ) : (
                            topArtists?.map((artist, index) => (
                                <TopUserArtistEntry artist={artist} idx={index} key={index} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </Container>

    );
};

export default Page;
