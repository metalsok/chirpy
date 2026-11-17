import type {Request, Response} from 'express';

export const handlerReadiness = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send("OK")
}

