import {DetailedTrack} from "@shared/types";
import moment from "moment";

export type UserTrackEntryProps = {
    track: DetailedTrack;
    isActive?: boolean; // is currently listening
}

export const UserTrackEntrySkeleton = () => {

    return (
        <div className={'flex justify-between gap-4 bg-card-background p-4 rounded-xl'}>
            <div className="flex items-center gap-2 mt-4">
                <div className={'size-12 rounded-lg bg-gray-600 animate-pulse'}/>
                <p className={'w-12 h-4 bg-gray-600 animate-pulse'}></p>
                <p className={'w-12 h-4 bg-gray-600 animate-pulse'}></p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <p className={'w-12 h-4 bg-gray-600 animate-pulse'}></p>
            </div>
        </div>
    )
}

const UserTrackEntry = ({track, isActive = false}: UserTrackEntryProps) => {

    return (
        <div className={`flex justify-between gap-4 p-4 rounded-xl ${isActive ? 'bg-active-card-background' : 'bg-card-background'}`}>
            <div className="flex items-center gap-2">
                <img src={`${track.imageUrl}`} className={'size-12 rounded-lg'}/>
                <a className={'hover:underline'} href={`/track/${track.id}`}><b>{track.trackName}</b></a>
                <p>{track.artists.map(a => a.artistName).join(', ')}</p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <p>{isActive ? 'Now  playing' : moment(track?.playedAt).fromNow()}</p>
            </div>
        </div>
    )
}

export default UserTrackEntry;