import {Request, Response, Router} from "express";
import * as querystring from "node:querystring";
import axios from "axios";
import {db} from "@/shared/db";
import {users} from "@/shared/drizzle/schema";
import {eq} from "drizzle-orm";
import {NewUser} from "@/shared/types";
import {generateToken, saveTokenAsCookie} from "../../../util/jwt";
import {redirectFrontend} from "../../../util/util";

const router = Router();

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

router.get("/", async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!state) {
        return res.redirect(
            "/#" +
            querystring.stringify({
                error: "state_mismatch",
            })
        );
    }

    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${CLIENT_ID}:${CLIENT_SECRET}`
                    ).toString("base64")}`,
                },
            }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        const profileResponse = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const spotifyProfile = profileResponse.data;
        const spotifyId = spotifyProfile.id;
        const displayName = spotifyProfile.display_name;
        const email = spotifyProfile.email;
        const profileImage = spotifyProfile.images?.[0]?.url || null;


        let user = await db.select().from(users).where(eq(users.spotifyId, spotifyId));

        if (user.length === 0) {
            // if usr doesnt exist, create it
            const newUser: NewUser = {
                spotifyId,
                username: displayName,
                email,
                profileImage,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: new Date(Date.now() + expires_in * 1000),
            };

            user = await db
                .insert(users)
                .values(newUser)
                .onConflictDoUpdate({ // if username is taken you username will be set to your spotify ID
                    target: users.username,
                    set: { username: spotifyId },
                })
                .returning();

        } else {
            await db // update old user tokens
                .update(users)
                .set({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt: new Date(Date.now() + expires_in * 1000),
                    lastLogin: new Date(),
                })
                .where(eq(users.spotifyId, spotifyId));
        }

        const token = generateToken(user[0]);
        saveTokenAsCookie(res, token);
        redirectFrontend(res, `/user/${user[0].username}?m=login+successful`);
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
        res.redirect(
            "/#" +
            querystring.stringify({
                error: "invalid_token",
            })
        );
    }
});

export default router;
