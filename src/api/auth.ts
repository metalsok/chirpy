import {Request, Response} from "express";
import {UnauthorizedError} from "./error-classes.js";
import {getBearerToken, makeJWT} from "../auth.js";
import {findAndRevoke, findOne} from "../db/queries/auth.js";

export async function refreshTokenHandler(req: Request, res: Response) {
    const refreshToken = getBearerToken(req)
    const [found] = await findOne(refreshToken)
    if (!found) {
        throw new UnauthorizedError('Invalid token')
    }

    if (found.revoked_at && new Date(found.revoked_at) < new Date()) {
        throw new UnauthorizedError('Refresh token expired')
    }
    const newToken = makeJWT(found.userId)
    res.status(200).send({
        token: newToken
    })
}

export async function revokeTokenHandler(req: Request, res: Response) {
    const refreshToken = getBearerToken(req)
    await findAndRevoke(refreshToken)

    res.status(204).send()
}
