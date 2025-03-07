import express, {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {handleReqError} from "../util/exceptions";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
   try {
      const loggedIn = !!req.session?.uid;
      const id = parseInt(req.params.id);

      const isYou = id === req.session?.uid; // if it's your profile

      res.render("index", {loggedIn, isYou, userId: req.session?.uid});
   } catch (e) {
      handleReqError(req, res);
   }

});

export default router;