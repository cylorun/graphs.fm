import {DetailedTrack} from "@shared/types";

export type UserTrackEntryProps = {
    track: DetailedTrack;
}

const UserTrackEntry = ({track}: UserTrackEntryProps) => {

    return (
        <div className={'flex items-center gap-4 bg-card-background p-4 rounded-xl'}>
            <img src={`${track.imageUrl}`} className={'size-12 rounded-lg'}/>
            <p>{track.trackName}</p>
            <p>{track.artists.map(a => a.artistName).join(', ')}</p>
            <p>{track?.playedAt?.toLocaleString()}</p>
        </div>
    )
}

export default UserTrackEntry;