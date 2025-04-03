import {db} from "../db";
import {users, userTracks} from "../drizzle/schema";
import {and, count, eq} from "drizzle-orm";
import {PublicUser, User} from "../types";
import {between} from "drizzle-orm/sql/expressions/conditions";


// returns null if user doesnt exist
export async function resolveUid(identifier: string): Promise<number | null> {
    let uid: number = parseInt(identifier);
    if (isNaN(uid)) {
        const d = await getUserId(identifier);
        if (!d) {
            return null;
        }

        uid = d;
    }

    return uid;
}

export async function getUserProfileImageUrl(userId: number): Promise<string | null> {
    return (await db.select({url: users.profileImage}).from(users).where(eq(users.id, userId)))[0]?.url || null;
}

export async function getUserId(username: string): Promise<number | null> {
    return (await db.select().from(users).where(eq(users.username, username)))[0]?.id || null;
}

export async function getUserById(userId: number): Promise<PublicUser | null> {
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) return null;

    const { accessToken, refreshToken, expiresAt, lastLogin, ...userWithoutToken } = user;

    return {plays: (await getUserPlaysSince(userId, new Date(0))) || 0, ...userWithoutToken};
}

export async function getUserPlaycount(uid: number): Promise<{day: number, week: number, month: number} | null> {
    const hr24ago = new Date(Date.now() - (1000 * 60 * 60 * 24))
    const weekago = new Date(Date.now() - (1000 * 60 * 60 * 24 * 7));
    const monthago = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30));

    if (!await getUserById(uid)) {
        return null;
    }

    // none of these should never be null, since that case is handled in the above statement
    return {
        day: (await getUserPlaysSince(uid, hr24ago))!,
        week: (await getUserPlaysSince(uid, weekago))!,
        month: (await getUserPlaysSince(uid, monthago))!
    }
}

export async function getUserPlaysSince(uid: number, since: Date): Promise<number | undefined> {
    return (await db
        .select({val: count()})
        .from(userTracks)
        .where(and(eq(userTracks.userId, uid), between(userTracks.playedAt, since, new Date()))))[0].val;

}