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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        const fetchTracks = async () => {
            if (!uid) return;
            setLoading(true);
            try {
                const res = await api.get(`/users/${uid}/tracks?count=20`);

                if (res.status === 200) {
                    setTracks(res.data);
                    return;
                }

                setError(new Error(res.statusText));
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
                {tracks && tracks.map((track, idx) => (
                    <li key={idx}><UserTrackEntry track={track}/></li>
                ))}
            </ul>
        </div>
    )

}

export default RecentUserTracks;
