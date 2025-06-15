import {Request, Response, Router} from "express";
const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL!;
router.get("/", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect(FRONTEND_URL);
});

export default router;