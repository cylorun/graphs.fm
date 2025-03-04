import {Request, Response, Router} from "express";
const router = Router();

router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;