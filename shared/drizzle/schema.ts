import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", {length: 50}).unique().notNull(),
    username: varchar("username", {length: 50}).unique().notNull(),
    email: varchar("email", {length: 100}).unique().notNull(),
    profileImage: text("profile_image"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    timezone: varchar("timezone", {length: 50}).default('UTC').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login").defaultNow().notNull(),
});


export const tracks = pgTable("tracks", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    trackName: varchar("track_name", { length: 255 }).notNull(),
    durationMs: integer("duration_ms").notNull(),
    imageUrl: text("image_url"),
    albumId: integer("album_id")
        .references(() => albums.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow()
});

export const albums = pgTable("albums", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    albumName: varchar("album_name", { length: 255 }).notNull(),
    imageUrl: text("image_url"),
    releaseDate: timestamp("release_date"),
    artistId: integer("artist_id").notNull()
        .references(() => artists.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow()
});

export const userTracks = pgTable("user_tracks", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}),
    trackId: integer("track_id").references(() => tracks.id, {onDelete: "cascade"}),
    playedAt: timestamp("played_at", {withTimezone: true}).defaultNow(),
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
