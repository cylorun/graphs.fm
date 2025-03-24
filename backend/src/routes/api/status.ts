import express, {Request, Response, Router} from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "allg"});
});

export default router;