import {Request, Response} from 'express'
import {createUser, getUser, getUsers} from "../db/queries/users.js";
import {checkPasswordHash, hashPassword} from "./auth.js";
import {NewUser} from "../db/schema.js";
import {UnauthorizedError} from "./error-classes.js";

type User = Omit<NewUser, 'password'>

export const createUserHandler = async (req: Request, res: Response) => {
    const {email, password} = req.body
    const hashedPassword = await hashPassword(password)
    const newUser: NewUser = await createUser({email, password: hashedPassword})
    const {password: _password, ...userResponse} = newUser
    res.status(201).send(userResponse)
}

export const loginUserHandler = async (req: Request, res: Response) => {
    const {email, password} = req.body
    const user = await getUser(email)
    const passwordMatch = await checkPasswordHash(user.password, password)
    if (!passwordMatch) {
        throw new UnauthorizedError("incorrect email or password")
    }
    const {password: _password, ...userResponse} = user
    res.status(200).send(userResponse)
}

export const getAllUsersHandler = async (req: Request, res: Response) => {
    const users: User[] = await getUsers()
    res.status(200).send(users)
}

export const getUserHandler = async (req: Request, res: Response) => {
    const {email} = req.body
    const user = await getUser(email)
    res.status(200).send(user)
}
