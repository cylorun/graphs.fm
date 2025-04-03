import {useEffect, useState} from "react";
import {DetailedTrack} from '@shared/types'
import api from "@/util/api";
import UserTrackEntry, {UserTrackEntrySkeleton} from "@/components/user-track-entry";

export type RecentUserTracksProps = {
    uid?: string;
}

export const RecentUserTracksSkeleton = ({rows}: {rows: number}) => {
    return (
        <div className={'flex'}>
            <ul className={'flex flex-col gap-2 mt-4'}>
                {Array.from({length: rows}).map((_, idx) => (
                    <li key={idx}><UserTrackEntrySkeleton /></li>
                ))}
            </ul>
        </div>
    );
}

const RecentUserTracks = ({uid}: RecentUserTracksProps) => {
    const [tracks, setTracks] = useState<DetailedTrack[]>([]);
    const [currTrack, setCurrTrack] = useState<DetailedTrack | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        const fetchTracks = async () => {
            if (!uid) return;
            setLoading(true);
            try {
                const allTracksResponse = await api.get(`/users/${uid}/tracks/recent?count=20`);
                if (allTracksResponse.status === 200) {
                    setTracks(allTracksResponse.data);
                } else {
                    setError(new Error(allTracksResponse.statusText));
                }

                const currTrackResponse = await api.get(`/users/${uid}/now-playing`);
                if (currTrackResponse.status === 200) {
                    setCurrTrack(currTrackResponse.data);
                    // console.log("currtrack:" , currTrackResponse.data.artists);
                } else if (currTrackResponse.status !== 204) { // no content / no track playing
                    setError(new Error(currTrackResponse.statusText));
                }

            } catch (e) {
                setError(new Error("Something went wrong :///"));
            } finally {
                setLoading(false);
            }
        }

        fetchTracks();
    }, [uid]);

    return (
        <div className={'flex'}>
            <ul className={'flex flex-col gap-2 mt-4'}>
                {currTrack && (
                    <li><UserTrackEntry isActive={true} track={currTrack}/></li>
                )}
                {tracks && tracks.map((track, idx) => (
                    <li key={idx}><UserTrackEntry track={track}/></li>
                ))}
            </ul>
        </div>
    )

}

export default RecentUserTracks;
