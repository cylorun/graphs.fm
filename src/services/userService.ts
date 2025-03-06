import {db} from "../db";
import {users} from "../db/schema";
import {eq} from "drizzle-orm";
import {PublicUser, User} from "../types";

export async function getUserProfileImageUrl(userId: number): Promise<string | null> {
    return (await db.select({url: users.profileImage}).from(users).where(eq(users.id, userId)))[0].url || null;
}

export async function getUserById(userId: number): Promise<PublicUser | null> {
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) return null;

    const { accessToken, refreshToken, expiresAt, ...userWithoutToken } = user;

    return userWithoutToken;
}
