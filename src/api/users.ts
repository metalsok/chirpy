import {Request, Response} from 'express'
import {createUser, getUser, getUsers, updateUser} from "../db/queries/users.js";
import {checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT} from "./auth.js";
import {UnauthorizedError} from "./error-classes.js";
import {createRefreshToken} from "../db/queries/auth.js";
// auth.ts, near makeRefreshToken
const REFRESH_TOKEN_DURATION_MS = 60 * 24 * 60 * 60 * 1000

export const createUserHandler = async (req: Request, res: Response) => {
    const {email, password} = req.body
    const hashedPassword = await hashPassword(password)
    const newUser = await createUser({email, password: hashedPassword})
    res.status(201).send(newUser)
}

export const updateUserHandler = async (req: Request, res: Response) => {
    const token = getBearerToken(req)
    const userId = validateJWT(token)
    const {email, password} = req.body


    const user = await updateUser(userId, email, password)
    res.status(200).send(user)
}

export const loginUserHandler = async (req: Request, res: Response) => {
    const {email, password} = req.body
    const user = await getUser(email)
    const passwordMatch = await checkPasswordHash(user.password, password)
    if (!passwordMatch) {
        throw new UnauthorizedError("incorrect email or password")
    }
    const {password: _password, ...userResponse} = user
    const token = makeJWT(user.id)
    const tok = makeRefreshToken()
    const refreshTokenExp = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS)
    const refreshToken = await createRefreshToken(tok, user.id, refreshTokenExp)

    res.status(200).send({...userResponse, token, refreshToken: refreshToken.token})
}

export const getAllUsersHandler = async (req: Request, res: Response) => {
    const users = await getUsers()
    res.status(200).send(users)
}

export const getUserHandler = async (req: Request, res: Response) => {
    const {email} = req.body
    const user = await getUser(email)
    const {password: _password, ...userResponse} = user
    res.status(200).send(userResponse)
}
