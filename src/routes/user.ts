import {Request, Response, Router} from "express";
import {handleReqError} from "../util/exceptions";


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const loggedIn = !!req.session?.uid;
        if (!loggedIn) {
            res.redirect('/login');
            return;
        }

        res.redirect(`/user/${req.session.uid}`);
    } catch (e) {
        handleReqError(req, res);
    }

});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const loggedIn = !!req.session?.uid;

        res.render("user", {loggedIn, userId: req.session?.uid});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;