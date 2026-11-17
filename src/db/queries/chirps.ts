import {db} from "../index.js";
import {chirps, NewChirp} from "../schema.js";
import {asc, eq} from 'drizzle-orm';
import {NotFoundError} from "../../api/error-classes.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getChirps() {
    return db.select().from(chirps).orderBy(asc(chirps.createdAt))
}

export async function getChirp(id: string) {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id))
    if (!chirp) {
        throw new NotFoundError(`Chirp with id ${id} not found`)
    }
    return chirp
}
