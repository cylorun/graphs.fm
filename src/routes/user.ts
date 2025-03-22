import {Request, Response, Router} from "express";
import {handleReqError} from "../util/exceptions";
import {getDefaultEjsProps} from "../util/util";


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
        res.render("user", {...getDefaultEjsProps(req, res), section: 'overview'});
    } catch (e) {
        handleReqError(req, res);
    }
});

router.get('/:id/reports', async (req: Request, res: Response) => {
    try {
        res.render("user", {...getDefaultEjsProps(req, res), section: 'reports'});
    } catch (e) {
        handleReqError(req, res);
    }
});

router.get('/:id/top', async (req: Request, res: Response) => {
    try {
        res.render("user", {...getDefaultEjsProps(req, res), section: 'top'});
    } catch (e) {
        handleReqError(req, res);
    }
});

router.get('/:id/following', async (req: Request, res: Response) => {
    try {
        res.render("user", {...getDefaultEjsProps(req, res), section: 'following'});
    } catch (e) {
        handleReqError(req, res);
    }
});

export default router;