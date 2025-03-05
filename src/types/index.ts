import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {tracks, users, userTracks} from "../db/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Track = InferSelectModel<typeof tracks>;
export type NewTrack = InferInsertModel<typeof tracks>;
export type UserTrack = InferSelectModel<typeof userTracks>;
export type NewUserTrack = InferInsertModel<typeof userTracks>;
