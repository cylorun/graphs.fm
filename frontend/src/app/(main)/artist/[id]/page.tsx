'use client'
import React, {useMemo} from "react";
import Container from "@/components/container";
import {Album, DetailedArtist, DetailedTrack} from "@shared/types";
import Image from "next/image";
import {useSession} from "@/hooks/session-context";
import SimpleLineChart from "@/components/line-chart";
import ArtistOverview, {ArtistOverviewSkeleton} from "@/components/artists/artist-overview";
import CommentsContainer from "@/components/comments-container";
import {useApi} from "@/hooks/useApi";
import { useUnwrappedParams } from "@/hooks/useUnwrappedParams";

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
    const {id: artistId} = useUnwrappedParams(params, ['id']) || {};

    const {user} = useSession();
    const {data: artist, status: trackStatus} = useApi<DetailedArtist | null>(artistId ? `/artists/${artistId}` : null);
    const {data: _userListeningTimes, status: listeningTimesStatus} = useApi<any>(artistId && user?.id ?`/artists/${artistId}/${user?.id}` : null);

    const userListeningTimes =  useMemo(() => {
        if (!_userListeningTimes) return;
        return transformPlayTimestamps(_userListeningTimes);
    }, [_userListeningTimes]);

    if (listeningTimesStatus === 'loading' || trackStatus === 'loading') return <PageSkeleton />;
    if (trackStatus === 'error' || listeningTimesStatus === 'error' || !artist || !userListeningTimes) {
        return <Container className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500">error idk</p></Container>;
    }

    return (
        <Container className="flex flex-col text-center min-h-screen px-5 pt-32 md:pt-40 gap-2">
            {/*top section*/}
            <div className={'flex md:flex-row flex-col border-b border-b-foreground-accent pb-4'}>
                <div className={'flex flex-row items-end gap-2 md:w-[70%] w-full'}>
                    <Image
                        src={artist?.imageUrl || "/placeholder.jpg"}
                        alt={artist?.artistName || "Artist name"}
                        width={200}
                        height={200}
                        className="rounded-lg shadow-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
                    />
                    <div className={'flex flex-col items-start'}>
                        <h2 className="text-2xl font-bold mt-4 mb-2 text-left">{artist.artistName}</h2>
                        <div className="flex flex-col md:items-center items-start md:flex-row md:gap-2">
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
                        {/*<p className="text-sm text-foreground-muted  mt-2">Plays: {artist.plays} {artist.yourPlaycount !== undefined ? ` | Your Plays: ${artist.yourPlaycount}` : ''}</p>*/}
                    </div>
                </div>
                <div className={'flex w-full m-0 p-0 md:mt-0 mt-4'}>
                    {user && (
                        <SimpleLineChart data={userListeningTimes} xKey={'time'} yKey={'plays'} yLabel={'Your Plays'}/>
                    )}
                </div>
            </div>

            {/*middle section*/}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="w-full md:w-[30%]">
                    <ArtistOverview artist={artist} />
                </div>
                {/* Ratings section (if re-enabled later) */}
            </div>

            {/*bottom section*/}
            <div className="mt-6">
                <CommentsContainer postId={Number(artistId)} postType="track" />
            </div>

        </Container>
    );
};

export default Page;
