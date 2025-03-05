import {integer, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    displayName: varchar("display_name", { length: 100 }),
    email: varchar("email", { length: 100 }).unique(),
    profileImage: text("profile_image"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    lastLogin: timestamp("last_login").defaultNow(),
});

export const tracks = pgTable("tracks", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    trackName: varchar("track_name", { length: 255 }).notNull(),
    artist: varchar("artist", { length: 255 }).notNull(),
    album: varchar("album", { length: 255 }).notNull(),
    durationMs: integer("duration_ms").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const userTracks = pgTable("user_tracks", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    trackId: integer("track_id").references(() => tracks.id, { onDelete: "cascade" }),
    playedAt: timestamp("played_at").defaultNow(),
});


