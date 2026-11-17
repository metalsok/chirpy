import type {Request, Response} from 'express';
import {config} from '../config.js';
import {deleteUsers} from "../db/queries/users.js";

export const handlerReset = async (req: Request, res: Response) => {
    if (config.api.platform === "dev") {
        await deleteUsers()
        res.status(200).send({
            deleted: true
        })
    } else {
        res.status(403).send({
            action: "Forbidden"
        })
    }
}

export const handlerMetrics = (req: Request, res: Response) => {
    res.type("text/html;charset=utf-8")
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`)
}
