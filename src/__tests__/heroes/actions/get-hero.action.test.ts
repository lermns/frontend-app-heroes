import { describe, expect, test } from "vitest";
import { getHero } from "../../../heroes/actions/get-hero.action"


describe("getHeroAction", () => {
    test("should fetch hero data and return with complete image url", async () => {
        const result = await getHero("clark-kent");

        expect(result.image).toContain("http");

        expect(result).toStrictEqual({
            id: expect.any(String),
            name: expect.any(String),
            slug: 'clark-kent',
            alias: expect.any(String),
            powers: expect.any(Array<String>),
            description: expect.any(String),
            strength: expect.any(Number),
            intelligence: expect.any(Number),
            speed: expect.any(Number),
            durability: expect.any(Number),
            team: expect.any(String),
            image: expect.any(String),
            firstAppearance: expect.any(String),
            status: expect.any(String),
            category: expect.any(String),
            universe: expect.any(String)
        }
        );
    })

    test("should throw an error if hero is not found", async () => {
        const result = await getHero("clark-kent2").catch((error) => {
            expect(error).toBeDefined();
            expect(error.message).toBe("Request failed with status code 404");
        });

        expect(result).toBeUndefined();

    })
})