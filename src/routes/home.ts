import express, {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
   const loggedIn = req.session?.uid;

   res.render("index", {loggedIn});
});

export default router;