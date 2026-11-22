import {describe, expect, it} from "vitest";
import {censorProfanity} from "../api/chirps.js";

describe("Profanity censoring", () => {
    it("censors a listed profane word", () => {
        const result = censorProfanity("I had a kerfuffle this morning")
        expect(result).toEqual("I had a **** this morning")
    })

    it("leaves a clean chirp unchanged", () => {
        const result = censorProfanity("This is a perfectly normal chirp")
        expect(result).toEqual("This is a perfectly normal chirp")
    })

    it("censors regardless of casing", () => {
        const result = censorProfanity("What the Sharbert is going on")
        expect(result).toEqual("What the **** is going on")
    })
});
