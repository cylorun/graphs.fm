'use client'
import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import api from "@/util/api";
import {Album, DetailedTrack, TrackNotFoundException} from "@shared/types";
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
    const [track, setTrack] = useState<DetailedTrack & {album: Album} | null>(null);

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
                const res = await api.get(`/tracks/${trackId}?albumdata=1&userdata=1`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    console.log(res.data);
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

    if (!error && (loading || !track)) return <PageSkeleton />;
    if (error || !track) return <Container className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500">{error?.message}</p></Container>;

    return (
        <Container className="flex flex-col text-center min-h-screen px-5 pt-32 md:pt-40">
            <div className={'flex flex-row items-end gap-2'}>
                <Image
                    src={track?.imageUrl || "/placeholder.jpg"}
                    alt={track?.trackName || "Album cover"}
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg"
                />
                <div className={'flex flex-col items-start'}>
                    <h2 className="text-2xl font-bold mt-4">{track.trackName}</h2>
                    <div className="">
                        {track?.artists.map(artist => (
                            <a  href={`/artist/${artist.id}`} key={artist.id} className="flex flex-col items-center">
                                <p className="text-lg text-gray-500 mt-1">{artist.artistName}</p>
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-foreground-muted  mt-2">Plays: {track.plays} {track.yourPlaycount !== undefined ? ` | Your Plays: ${track.yourPlaycount}` : ''}</p>
                </div>

            </div>

        </Container>
    );
};

export default Page;
