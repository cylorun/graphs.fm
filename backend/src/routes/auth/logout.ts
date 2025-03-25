import {Request, Response, Router} from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;