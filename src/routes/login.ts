import {Request, Response, Router} from "express";
import {handleReqError} from "../util/exceptions";
import {getDefaultEjsProps} from "../util/util";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    try {
        const loggedIn = req.session?.uid;

        if (loggedIn) {
            res.redirect('/user');
            return;
        }

        res.render("login", {...getDefaultEjsProps(req, res)});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;