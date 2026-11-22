import {beforeAll, describe, expect, it} from "vitest";
import {checkPasswordHash, extractApiKey, extractBearerToken, hashPassword, makeJWT, validateJWT} from "../auth.js";
import {UnauthorizedError} from "../api/error-classes.js";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let authToken = "$argon2id$v=19$m=65536,t=3,p=4$scKsXjJ12aNRd2ne+5Lnjg$DDIhVoAoq+UiUY0GeW/7m6RvY3SnUQ91ByFH40AdDPM"
    let token: string


    beforeAll(async () => {
        hash1 = await hashPassword(password1);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(hash1, password1);
        expect(result).toBe(true);
    });

    it("should sign a jwt", () => {
        token = makeJWT("1", "test")
        expect(token).toBeDefined()
    })
    it("should validate a jwt token", () => {
        const sub = validateJWT(token, "test")
        expect(sub).toBe("1")
    })

    it("should extract Bearer token", () => {
        const extractedToken = extractBearerToken(`Bearer ${authToken}`)
        expect(extractedToken).toEqual(authToken)
    })

    it("should throw unauthorized error if auth token undefined", () => {
        expect(() => extractBearerToken(undefined)).toThrow(UnauthorizedError)
    })

    it("should extract an api key", () => {
        const extractedKey = extractApiKey("ApiKey some-key-value")
        expect(extractedKey).toEqual("some-key-value")
    })

    it("should throw unauthorized error if api key header is missing", () => {
        expect(() => extractApiKey(undefined)).toThrow(UnauthorizedError)
    })

    it("should throw unauthorized error for a token signed with a different secret", () => {
        const otherToken = makeJWT("1", "a-different-secret")
        expect(() => validateJWT(otherToken, "test")).toThrow(UnauthorizedError)
    })

    it("should throw unauthorized error for a malformed token", () => {
        expect(() => validateJWT("not-a-real-token", "test")).toThrow(UnauthorizedError)
    })
});