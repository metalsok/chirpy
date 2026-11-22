import {db} from "../index.js";
import {chirps, NewChirp} from "../schema.js";
import {asc, desc, eq} from 'drizzle-orm';
import {NotFoundError} from "../../api/error-classes.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getChirps(authorId?: string, sort = "asc") {
    return db.select().from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(sort === "asc" ? asc(chirps.createdAt) : desc(chirps.createdAt))
}

export async function getChirpById(id: string) {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id))
    if (!chirp) {
        throw new NotFoundError(`Chirp with id ${id} not found`)
    }
    return chirp
}

export async function deleteChirp(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id))
}

