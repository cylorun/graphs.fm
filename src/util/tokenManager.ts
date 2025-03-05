import axios from 'axios';
import {db} from "../db";
import {users} from "../db/schema";
import {eq} from "drizzle-orm";

export const refreshAccessToken = async (uid: number) => {
    const user = (await db.select({refreshToken: users.refreshToken}).from(users).where(eq(users.id, uid)))[0];
    if (!user) {
        throw new Error("No such user");
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID!,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET!
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        if (response.status !== 200) {
            throw new Error("Failed to refresh token")
        }

        const {access_token, expires_in,refresh_token} = response.data;

        await db.update(users).set({accessToken: access_token, expiresAt: new Date(Date.now() + expires_in * 1000), refreshToken: refresh_token});
    } catch (error) {
        throw new Error('Failed to refresh access token');
    }
};
