import {Request, Response, Router} from "express";
import {handleReqError} from "../util/exceptions";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    try {
        const loggedIn = req.session?.uid;

        if (loggedIn) {
            res.redirect('/user');
            return;
        }

        const id = parseInt(req.params.id);
        const isYou = id === req.session?.uid; // if it's your profile

        res.render("login", {loggedIn, isYou, userId: req.session?.uid});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;