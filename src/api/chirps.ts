import {Request, Response} from 'express'
import {createChirp, getChirp, getChirps} from "../db/queries/chirps.js";
import {BadRequestError} from "./error-classes.js";

function censorProfanity(body: string) {
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
    const {body, userId} = req.body
    if (body.length >= 139) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanBody = censorProfanity(body)

    const newChirp = await createChirp({body: cleanBody, userId})
    res.status(201).send(newChirp)
}

export async function getAllChirpsHandler(req: Request, res: Response) {
    const chirps = await getChirps()
    res.status(200).send(chirps)
}

export async function getChirpHandler(req: Request<{ id: string }>, res: Response) {
    const {id} = req.params
    const chirp = await getChirp(id)
    res.status(200).send(chirp)
}
