import {Request, Response, Router} from "express";
import {getDefaultEjsProps} from "../util/util";
const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
    res.render("artist", {...getDefaultEjsProps(req, res)});
});


export default router;