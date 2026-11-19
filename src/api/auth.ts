import * as argon2 from "argon2";
import type {JwtPayload} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import {Request} from "express";
import {BadRequestError, UnauthorizedError} from "./error-classes.js";
import {config} from "../config.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password)

}

export async function checkPasswordHash(hash: string, password: string,): Promise<boolean> {
    return argon2.verify(hash, password)
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000)
    const payload: payload = {
        iss: 'chirpy',
        sub: userID,
        iat,
        exp: iat + expiresIn
    }
    return jwt.sign(payload, secret)
}

export function validateJWT(tokenString: string, secret?: string): string {
    secret = secret ?? config.api.secret
    if (!secret) {
        throw new Error('Secret is missing')
    }
    const payload = jwt.verify(tokenString, secret) as payload

    if (!payload.sub) {
        throw new UnauthorizedError("token is expired")
    }
    return payload.sub
}

export function extractBearerToken(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new BadRequestError("Auth token is missing")
    }
    return authorization.slice("Bearer ".length)
}

export function getBearerToken(req: Request): string {
    const {authorization} = req.headers
    return extractBearerToken(authorization)
}

