import {Request, Response} from 'express'
import {createChirp, deleteChirp, getChirpById, getChirps} from "../db/queries/chirps.js";
import {BadRequestError, ForbiddenError} from "./error-classes.js";
import {getBearerToken, validateJWT} from "../auth.js";

export function censorProfanity(body: string) {
    const profaneWords = ["kerfuffle", "sharbert", "fornax"]
    const bodyArray = body.split(" ")

    return bodyArray.map(word => {
        if (profaneWords.includes(word.toLowerCase())) {
            return '****'
        }
        return word
    }).join(" ")
}

export async function createChirpHandler(req: Request, res: Response) {
    const {body} = req.body
    if (body.length >= 139) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanBody = censorProfanity(body)

    const token = getBearerToken(req)
    const userId = validateJWT(token)

    const newChirp = await createChirp({body: cleanBody, userId})
    res.status(201).send(newChirp)
}

export async function getAllChirpsHandler(req: Request, res: Response) {
    const authorId = typeof req.query.authorId === "string" ? req.query.authorId : undefined
    const sort = typeof req.query.sort === "string" ? req.query.sort : undefined
    const chirps = await getChirps(authorId,sort)
    res.status(200).send(chirps)
}

export async function getChirpHandler(req: Request<{ id: string }>, res: Response) {
    const {id} = req.params
    const chirp = await getChirpById(id)
    res.status(200).send(chirp)
}

export async function deleteChirpHandler(req: Request<{ id: string }>, res: Response) {
    const {id} = req.params

    const chirp = await getChirpById(id)
    const token = getBearerToken(req)
    const userId = validateJWT(token)
    if (userId !== chirp.userId) {
        throw new ForbiddenError("You are not allowed to do that")
    }


    await deleteChirp(req.params.id)
    res.status(204).send({deleted: true})
}
