import {Request, Response, Router} from "express";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    const loggedIn = req.session?.uid;

    if (loggedIn) {
        res.redirect('/dashboard');
        return;
    }

    const id = parseInt(req.params.id);
    const isYou = id === req.session?.uid; // if it's your profile

    res.render("login", {loggedIn, isYou, userId: req.session?.uid});
});

export default router;