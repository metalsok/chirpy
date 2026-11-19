import {db} from "../index.js";
import {NewUser, users} from "../schema.js";
import {eq, getTableColumns} from "drizzle-orm";
import {UnauthorizedError} from "../../api/error-classes.js";

const {password, ...tableColumnsWithoutPass} = getTableColumns(users)

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning(tableColumnsWithoutPass);
    return result;
}

export async function deleteUsers() {
    await db.delete(users)
}

export async function getUsers() {
    return db.select(tableColumnsWithoutPass).from(users)
}

export async function getUser(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) {
        throw new UnauthorizedError("Incorrect email or password")
    }
    return user
}