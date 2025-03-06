import express, {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
   const loggedIn = !!req.session?.uid;
   const id = parseInt(req.params.id);

   const isYou = id === req.session?.uid; // if it's your profile

   res.render("index", {loggedIn, isYou, userId: req.session?.uid});
});

export default router;