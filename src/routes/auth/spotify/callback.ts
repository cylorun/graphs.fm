import express, { Request, Response, Router } from "express";
import * as querystring from "node:querystring";
import axios from "axios"; // Import axios for HTTP requests

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

        console.log(tokenResponse.data);

        const { access_token } = tokenResponse.data;

        const playerResponse = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        res.json(playerResponse.data);
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
