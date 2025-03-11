import express, {Request, Response, Router} from "express";
import {getCurrentlyPlaying} from "../services/spotifyService";
import {handleReqError} from "../util/exceptions";
import {getDefaultEjsProps} from "../util/util";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
   try {
      res.render("index", {...getDefaultEjsProps(req, res)});
   } catch (e) {
      handleReqError(req, res);
   }
});

export default router;