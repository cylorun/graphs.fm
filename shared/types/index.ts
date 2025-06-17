import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {
    tracks,
    users,
    userTracks,
    artists,
    genres,
    artistGenres,
    artistTracks,
    albums,
    badges, comments, postTypes
} from "../drizzle/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Track = InferSelectModel<typeof tracks>;
export type NewTrack = InferInsertModel<typeof tracks>;
export type UserTrack = InferSelectModel<typeof userTracks>;
export type NewUserTrack = InferInsertModel<typeof userTracks>;
export type Album  = InferSelectModel<typeof albums>;
export type NewAlbum  = InferInsertModel<typeof albums>;
export type Artist = InferSelectModel<typeof artists>;
export type NewComment  = InferInsertModel<typeof comments>;
export type Comment = InferSelectModel<typeof comments>;
export type DetailedComment = Comment & {authorName: string | null, authorImageUrl: string | null, totalLikes: number, likedByYou: number | null};
export type NewArtist = InferInsertModel<typeof artists>;
export type Genre = InferSelectModel<typeof genres>;
export type NewGenre = InferInsertModel<typeof genres>;
export type ArtistGenre = InferSelectModel<typeof artistGenres>;
export type NewArtistGenre = InferInsertModel<typeof artistGenres>;
export type ArtistTracks = InferSelectModel<typeof artistTracks>;
export type NewArtistTracks = InferInsertModel<typeof artistTracks>
export type Badge = InferSelectModel<typeof badges>;
export type DetailedTrack = Track & {playedAt: Date | null} & {artists: Artist[], album?: Album | null, yourPlaycount?: number | null, plays?: number | null};
export type ArtistWithGenre = Artist & {genres: Genre[]}
export type PublicUser = Omit<User & {plays: number}, "expiresAt" | "refreshToken" | "accessToken" | "lastLogin">
export type PostType = typeof postTypes[number];

export type DetailedArtist = Artist & {genres: Genre[]};


export type JWTUser = {
    id: number;
    role: number;
    username: string;
}

export class UserNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class TrackNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ArtistNotFoundException  extends Error {
    constructor(message: string) {
        super(message);
    }
}