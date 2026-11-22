import {db} from "../index.js"
import {NewRefreshToken, refresh_tokens} from "../schema.js";
import {eq} from "drizzle-orm";

export async function createRefreshToken(token: string, userId: string, expired_at: Date) {
    const refreshToken: NewRefreshToken = {
        token,
        userId,
        expired_at
    }
    const [result] = await db.insert(refresh_tokens).values(refreshToken).returning()
    return result
}

export async function findOne(token: string) {
    return db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token))
}

export async function findAndRevoke(token: string) {
    return db.update(refresh_tokens).set({
        revoked_at: new Date(),
    }).where(eq(refresh_tokens.token, token)).returning()
}