'use client'
import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import api from "@/util/api";
import { DetailedTrack, TrackNotFoundException } from "@shared/types";
import Image from "next/image";
import {formatDuration} from "@/util/timeutil";

export type PageProps = {
    params: Promise<{ id: string }>;
};

const PageSkeleton = () => {
    return (
        <Container className="flex flex-col items-center text-center min-h-screen px-5 pt-32 md:pt-40">
            <div className={'size-[300px] rounded-lg shadow-lg bg-skeleton animate-pulse'}/>
            <div className="mt-4 w-32 h-8 bg-skeleton animate-pulse"></div>
            <p className="mt-1 w-24 h-4 bg-skeleton animate-pulse"></p>
            <p className="w-12 h-3 mt-2 bg-skeleton animate-pulse"></p>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Artists</h3>
                <div className="flex gap-4 mt-2">
                    <div className="flex flex-col items-center">
                        <div className="rounded-full size-[60px] bg-skeleton animate-pulse"/>
                        <p className="w-12 h-3 mt-1 bg-skeleton animate-pulse"></p>
                    </div>
                </div>
            </div>
        </Container>
    );
};

const Page = ({ params }: PageProps) => {
    const [trackId, setTrackId] = useState<string>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
            setError(null);

            try {
                const res = await api.get(`/tracks/${trackId}`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setTrack({
                        ...res.data,
                        createdAt: new Date(res.data.createdAt),
                    });
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new TrackNotFoundException("Track not found"));
                } else {
                    setError(new Error("Failed to fetch track data"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTrackData();
    }, [trackId]);

    if (loading) return <PageSkeleton />;
    if (error) return <Container className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500">{error.message}</p></Container>;

    return (
        <Container className="flex flex-col items-center text-center min-h-screen px-5 pt-32 md:pt-40">
            <Image
                src={track?.imageUrl || "/placeholder.jpg"}
                alt={track?.trackName || "Album cover"}
                width={300}
                height={300}
                className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-bold mt-4">{track?.trackName}</h2>
            <p className="text-lg text-gray-500">{track?.album}</p>
            <p className="text-sm text-foreground-muted  mt-2">Duration: {formatDuration(track?.durationMs || 0)}</p>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Artists</h3>
                <div className="flex gap-4 mt-2">
                    {track?.artists.map(artist => (
                        <div key={artist.id} className="flex flex-col items-center">
                            <Image
                                src={artist.imageUrl || "/placeholder-artist.jpg"}
                                alt={artist.artistName}
                                width={60}
                                height={60}
                                className="rounded-full"
                            />
                            <p className="text-sm text-gray-600 mt-1">{artist.artistName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default Page;
