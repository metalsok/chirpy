import {db} from "../index.js";
import {NewUser, users} from "../schema.js";
import {eq, getTableColumns} from "drizzle-orm";
import {UnauthorizedError} from "../../api/error-classes.js";
import {extractBearerToken} from "../../api/auth.js";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function deleteUsers() {
    await db.delete(users)
}

const {password, ...tableColumnsWithoutPass} = getTableColumns(users)

export async function getUsers() {
    console.log(extractBearerToken("Bearer $argon2id$v=19$m=65536,t=3,p=4$scKsXjJ12aNRd2ne+5Lnjg$DDIhVoAoq+UiUY0GeW/7m6RvY3SnUQ91ByFH40AdDPM"))
    return db.select().from(users)
}

export async function getUser(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) {
        throw new UnauthorizedError("Incorrect email or password")
    }
    return user
}