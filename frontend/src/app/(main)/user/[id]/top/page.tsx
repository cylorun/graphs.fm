'use client'
import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import UserNav, { UserNavSkeleton } from "@/components/user-nav";
import {Artist, DetailedTrack, PublicUser, UserNotFoundException} from "@shared/types";
import api from "@/util/api";
import Link from "next/link";
import {TopUserTrackEntry} from "@/components/top-user-track-entry";
import {TopUserArtistEntry} from "@/components/top-user-artist-entry";

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
    const [uid, setUid] = useState<string>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<PublicUser | null>(null);
    const [topTracks, setTopTracks] = useState<Omit<DetailedTrack & {playCount: number}, "playedAt">[]>([]);
    const [topArtists, setTopArtists] = useState<(Artist & {playCount: number})[]>([]);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await params;
            setUid(unwrappedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!uid) return;
            setLoading(true);

            try {
                const res = await api.get(`/users/${uid}`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setUser({
                        ...res.data,
                        createdAt: new Date(res.data.createdAt),
                        lastLogin: new Date(res.data.lastLogin),
                    });
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new UserNotFoundException("User not found"));
                    return;
                }
                setError(new Error("Failed to fetch user data: " + e.status));
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            if (!uid) return;
            try {
                const res = await api.get(`users/${uid}/tracks/top`);
                setTopTracks(res.data);
            } catch (e) {
                console.error("Failed to fetch top tracks:", e);
                setError(new Error("Failed to load top tracks"));
            }
        };

        const fetchTopArtists = async () => {
            if (!uid) return;
            try {
                const res = await api.get(`users/${uid}/artists/top`);
                setTopArtists(res.data);
            } catch (e) {
                console.error("Failed to fetch top tracks:", e);
                setError(new Error("Failed to load top artists"));
            }
        }

        fetchTopTracks();
        fetchTopArtists();
    }, [uid]);

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

    if (loading || !user) {
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
                        {topTracks.length === 0 ? (
                            <p className="text-foreground-muted">No tracks found</p>
                        ) : (
                            topTracks.map((track, index) => (
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
                        {topArtists.length === 0 ? (
                            <p className="text-foreground-muted">No artists found</p>
                        ) : (
                            topArtists.map((artist, index) => (
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
