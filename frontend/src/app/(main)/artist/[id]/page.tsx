'use client';
import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import api from "@/util/api";
import Image from "next/image";
import {ArtistNotFoundException, DetailedArtist, TrackNotFoundException} from "@shared/types";

export type PageProps = {
    params: Promise<{ id: string }>;
};

const PageSkeleton = () => (
    <Container className="flex flex-col items-center text-center min-h-screen px-5 pt-32 md:pt-40">
        <div className="size-[300px] rounded-lg shadow-lg bg-skeleton animate-pulse" />
        <div className="mt-4 w-32 h-8 bg-skeleton animate-pulse" />
        <div className="mt-2 w-40 h-5 bg-skeleton animate-pulse" />
        <div className="mt-4 flex gap-2 flex-wrap justify-center">
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="w-20 h-6 rounded-full bg-skeleton animate-pulse" />
            ))}
        </div>
    </Container>
);

const Page = ({ params }: PageProps) => {
    const [artistId, setArtistId] = useState<string>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [artist, setArtist] = useState<DetailedArtist | null>(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrapped = await params;
            setArtistId(unwrapped.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!artistId) return;

        const fetchArtist = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/artists/${artistId}`, {
                    validateStatus: status => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setArtist({
                        ...res.data,
                        createdAt: new Date(res.data.createdAt),
                    });
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new ArtistNotFoundException("Artist not found"));
                } else {
                    setError(new Error("Failed to fetch artist data"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [artistId]);

    if (loading) return <PageSkeleton />;
    if (error)
        return (
            <Container className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <p className="text-red-500 text-lg font-semibold">{error.message}</p>
            </Container>
        );

    return (
        <Container className="flex flex-col items-center text-center min-h-screen px-5 pt-32 md:pt-40">
            <Image
                src={artist?.imageUrl || "/placeholder.jpg"}
                alt={artist?.artistName || "Artist Image"}
                width={300}
                height={300}
                className="rounded-lg shadow-lg object-cover"
            />
            <h1 className="text-3xl font-bold mt-6">{artist?.artistName}</h1>

            <div className="mt-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    {artist?.genres?.length ? (
                        artist.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="px-3 py-1 text-sm bg-gray-200 rounded-full dark:bg-gray-700 dark:text-white"
                            >
                            {genre.genreName}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No genres listed</p>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default Page;
