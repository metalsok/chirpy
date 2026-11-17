import type {NextFunction, Request, Response} from 'express';
import {config} from './config.js';
import {BadRequestError, NotFoundError, UnauthorizedError} from './api/error-classes.js';

export const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    const {method, url} = req
    res.on("finish", () => {
        const {statusCode} = res
        if (statusCode !== 200) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`)
        }
    })
    next()
}

export const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
    ++config.api.fileserverHits
    next()
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof BadRequestError) {
        res.status(400).json({
            "error": err.message
        })
        return
    }
    if (err instanceof NotFoundError) {
        res.status(404).json({
            "error": err.message
        })
        return
    }
    if (err instanceof UnauthorizedError) {
        res.status(401).json({
            "error": err.message
        })
        return
    }
    res.status(500).json({
        "error": "Something went wrong on our end"
    })
}
