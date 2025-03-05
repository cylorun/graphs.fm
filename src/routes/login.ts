import {Request, Response, Router} from "express";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    const loggedIn = req.session.uid;

    if (loggedIn) {
        res.redirect('/dashboard');
        return;
    }

    res.render("login");
});

export default router;