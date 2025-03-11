import {Request, Response, Router} from 'express';
import {getTotalPlayCount} from "../../services/trackService";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const data = await getTotalPlayCount();

    res.status(200).json({count: data});
});