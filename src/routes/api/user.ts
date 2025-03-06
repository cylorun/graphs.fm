import {Request, Response, Router} from "express";
import {getUserById, getUserProfileImageUrl} from "../../services/userService";


const router = Router();

router.get('/', async (req: Request, res: Response) => {

    if (!req.session.uid) {
        res.status(403).json({error: "Not logged in"});
        return;
    }

    const data = await getUserById(req.session.uid);
    if (!data) {
        res.status(404).json({error: "User not found(idk how)"});
        return;
    }

    res.json(data);
});

router.get('/:id/pfp', async (req: Request, res: Response) => {
    const uid = parseInt(req.params.id);
    if (isNaN(uid)) {
        res.status(400).json({error: "Invalid uid"});
        return;
    }

    const url = await getUserProfileImageUrl(uid);
    if (!url) {
        res.status(404).json({error: "User not found"});
        return;
    }

    res.status(200).json({url: url});
});

export default router;