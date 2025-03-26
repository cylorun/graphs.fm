import {integer, json, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", {length: 50}).unique().notNull(),
    username: varchar("username", {length: 25}).unique().notNull(),
    email: varchar("email", {length: 100}).unique().notNull(),
    profileImage: text("profile_image").notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login").defaultNow().notNull(),
});

export const tracks = pgTable("tracks", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", {length: 50}).unique().notNull(),
    trackName: varchar("track_name", {length: 255}).notNull(),
    album: varchar("album", {length: 255}).notNull(),
    durationMs: integer("duration_ms").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const userTracks = pgTable("user_tracks", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}),
    trackId: integer("track_id").references(() => tracks.id, {onDelete: "cascade"}),
    playedAt: timestamp("played_at").defaultNow(),
});

export const artists = pgTable("artists", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    artistName: varchar("artist_name", { length: 100 }).notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const genres = pgTable("genres", {
    id: serial("id").primaryKey(),
    genreName: varchar("genre_name", { length: 100 }).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const artistGenres = pgTable("artist_genres", {
    id: serial("id").primaryKey(),
    artistId: integer("artist_id").notNull()
        .references(() => artists.id, { onDelete: "cascade" }),
    genreId: integer("genre_id").notNull()
        .references(() => genres.id, { onDelete: "cascade" }),
});

export const artistTracks = pgTable("artist_tracks", {
    id: serial("id").primaryKey(),
    artistId: integer("artist_id").notNull()
        .references(() => artists.id, { onDelete: "cascade" }),
    trackId: integer("track_id").notNull()
        .references(() => tracks.id, { onDelete: "cascade" }),
});
