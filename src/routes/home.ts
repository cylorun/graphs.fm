import express, {Request, Response, Router} from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
   res.send("oi");
});

export default router;