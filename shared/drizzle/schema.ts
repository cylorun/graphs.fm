import {pgTable, serial, integer, varchar, text, timestamp, bigint, index} from "drizzle-orm/pg-core";
import {ROLE_MASKS} from "../util/userrole";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    role: integer("role").notNull().default(ROLE_MASKS.viewer),
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

export const badges = pgTable("badges", {
    id: varchar("id").primaryKey(),
    badgeName: varchar("badge_name", {length: 50}).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
    id: serial("id"),
    userId: integer("user_id").notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    badgeId: varchar("badge_id").notNull()
        .references(() => badges.id, { onDelete: "cascade" }),
});


export const tracks = pgTable("tracks", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    trackName: varchar("track_name", { length: 255 }).notNull(),
    durationMs: integer("duration_ms").notNull(),
    imageUrl: text("image_url"),
    albumId: integer("album_id").notNull()
        .references(() => albums.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow()
});

export const albums = pgTable("albums", {
    id: serial("id").primaryKey(),
    spotifyId: varchar("spotify_id", { length: 50 }).unique().notNull(),
    albumName: varchar("album_name", { length: 255 }).notNull(),
    imageUrl: text("image_url"),
    releaseDate: text("release_date").notNull(), // only year | month | day
    releaseDatePrecision: text("release_date_precision").notNull(),
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

export const postTypes = ['track', 'artist', 'album'] as const;
export const comments = pgTable('comments', {
        id: serial('id').primaryKey(),
        content: text('content').notNull(),
        authorId: integer('author_id').notNull().references(() => users.id),
        postId: integer("post_id").notNull(),
        postType: text('post_type', {enum: postTypes}).notNull(),
        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow(),
});

export const commentLikes = pgTable('comment_likes', {
    userId: integer('user_id').notNull().references(() => users.id),
    commentId: integer('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' })
});