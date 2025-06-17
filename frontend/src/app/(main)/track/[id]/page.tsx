'use client'
import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import api from "@/util/api";
import {Album, DetailedTrack, TrackNotFoundException, UserNotFoundException} from "@shared/types";
import Image from "next/image";
import {formatDuration} from "@/util/timeutil";
import {useSession} from "@/context/session-context";
import SimpleLineChart from "@/components/line-chart";
import ArtistOverview, {ArtistOverviewSkeleton} from "@/components/artists/artist-overview";
import Comment from "@/components/comment";
import CommentsContainer from "@/components/comments-container";

export type PageProps = {
    params: Promise<{ id: string }>;
};

const PageSkeleton = () => {
    return (
        <Container className="flex flex-col text-center min-h-screen px-5 pt-32 md:pt-40 gap-2">
            {/*top section*/}
            <div className={'flex flex-row border-b border-b-foreground-accent pb-4'}>
                <div className={'flex flex-row items-end gap-2 w-[70%]'}>
                    <div
                        className="size-[200px] rounded-lg shadow-lg bg-skeleton animate-pulse"
                    />
                    <div className={'flex flex-col items-start'}>
                        <div className="h-8 w-48 mt-4 rounded-lg bg-skeleton animate-pulse"></div>
                        <div className="flex flex-row gap-2">
                            <div className="mt-4 mb-2 h-6 w-24 rounded-lg bg-skeleton animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className={'flex w-full m-0 p-0'}>
                    <div className={'w-full h-[200px] rounded-lg bg-skeleton animate-pulse'}/>
                </div>
            </div>

            {/*middle section*/}
            <div className={'flex flex-row justify-between gap-2 h-16'}>
                <div className={'flex w-[30%]'}>
                    <ArtistOverviewSkeleton />
                </div>
                {/*<div className={'flex border border-red-700 w-[70%]'}>*/}
                {/*    ratings*/}
                {/*</div>*/}
            </div>

            {/*bottom section*/}
            {/*<CommentsContainer postId={Number(trackId)} postType={'track'} />*/}

        </Container>
    );
};

function transformPlayTimestamps(timestamps: string[]) {
    const playsPerDay: Record<string, number> = {};

    timestamps.forEach((ts) => {
        const date = new Date(ts).toISOString().split('T')[0]; // 'YYYY-MM-DD'
        playsPerDay[date] = (playsPerDay[date] || 0) + 1;
    });

    return Object.entries(playsPerDay).map(([time, plays]) => ({ time, plays }));
}


const Page = ({ params }: PageProps) => {
    const [trackId, setTrackId] = useState<string>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [track, setTrack] = useState<DetailedTrack & {album: Album} | null>(null);
    const [userListeningTimes, setUserListeningTimes] = useState<any>([]);

    const {user} = useSession();

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

        const fetchUserListeningPoints = async () => {
            if (!trackId || !user) return;
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/tracks/${trackId}/${user.id}`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setUserListeningTimes(
                        transformPlayTimestamps(res.data)
                    );
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new UserNotFoundException("User not found"));
                } else {
                    setError(new Error("Failed to fetch user track data"));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchTrackData();
        fetchUserListeningPoints();
    }, [trackId, user]);

    if (!error && (loading || !track)) return <PageSkeleton />;
    if (error || !track) return <Container className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500">{error?.message}</p></Container>;

    return (
        <Container className="flex flex-col text-center min-h-screen px-5 pt-32 md:pt-40 gap-2">
            {/*top section*/}
            <div className={'flex flex-row border-b border-b-foreground-accent pb-4'}>
                <div className={'flex flex-row items-end gap-2 w-[70%]'}>
                    <Image
                        src={track?.imageUrl || "/placeholder.jpg"}
                        alt={track?.trackName || "Album cover"}
                        width={200}
                        height={200}
                        className="rounded-lg shadow-lg"
                    />
                    <div className={'flex flex-col items-start'}>
                        <h2 className="text-2xl font-bold mt-4 text-left">{track.trackName}</h2>
                        <div className="flex flex-row gap-2">
                            {track?.artists.map((artist, i) => (
                                <a href={`/artist/${artist.id}`} key={artist.id} className="flex flex-col items-center">
                                    <p className="text-lg text-gray-500 mt-1">{artist.artistName}{i !== track.artists.length-1 ? ', ' : ''}</p>
                                </a>
                            ))}
                        </div>
                        <p className="text-sm text-foreground-muted  mt-2">Plays: {track.plays} {track.yourPlaycount !== undefined ? ` | Your Plays: ${track.yourPlaycount}` : ''}</p>
                    </div>
                </div>
                <div className={'flex w-full m-0 p-0'}>
                     <SimpleLineChart data={userListeningTimes} xKey={'time'} yKey={'plays'} yLabel={'Your Plays'}/>
                </div>
            </div>

            {/*middle section*/}
            <div className={'flex flex-row justify-between gap-2 h-16'}>
                <div className={'flex w-[30%]'}>
                    <ArtistOverview artist={track?.artists[0]} />
                </div>
                {/*<div className={'flex border border-red-700 w-[70%]'}>*/}
                {/*    ratings*/}
                {/*</div>*/}
            </div>

            {/*bottom section*/}
            <CommentsContainer postId={Number(trackId)} postType={'track'} />

        </Container>
    );
};

export default Page;
