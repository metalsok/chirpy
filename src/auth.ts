import * as argon2 from "argon2";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Request} from "express";
import {UnauthorizedError} from "./api/error-classes.js";
import {config} from "./config.js";
import {randomBytes} from "node:crypto"

const {TokenExpiredError, JsonWebTokenError} = jwt;
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password)
}

export async function checkPasswordHash(hash: string, password: string,): Promise<boolean> {
    return argon2.verify(hash, password)
}

export function makeJWT(userID: string, secret?: string): string {
    secret = secret ?? config.api.secret
    if (!secret) {
        throw new Error('Secret is missing')
    }
    const iat = Math.floor(Date.now() / 1000)
    const payload: payload = {
        iss: 'chirpy',
        sub: userID,
        iat,
        exp: iat + 3600
    }
    return jwt.sign(payload, secret)
}

export function validateJWT(tokenString: string, secret?: string): string {
    secret = secret ?? config.api.secret
    if (!secret) {
        throw new Error('Secret is missing')
    }
    try {
        const payload = jwt.verify(tokenString, secret) as payload
        if (!payload.sub) {
            throw new UnauthorizedError("token is expired")
        }
        return payload.sub
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            throw new UnauthorizedError("invalid or expired token")
        }
        throw err
    }
}

export function extractBearerToken(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new UnauthorizedError("Auth token is missing")
    }
    return authorization.slice("Bearer ".length)
}

export function getBearerToken(req: Request): string {
    const {authorization} = req.headers
    return extractBearerToken(authorization)
}

export function makeRefreshToken() {
    return randomBytes(32).toString('hex')
}

export function extractApiKey(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith("ApiKey ")) {
        throw new UnauthorizedError("Api key is missing")
    }
    return authorization.slice("ApiKey ".length)
}

export function getApiKey(req: Request): string {
    const {authorization} = req.headers
    return extractApiKey(authorization)
}
