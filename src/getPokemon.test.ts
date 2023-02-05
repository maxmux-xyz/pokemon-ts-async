import { getPokemonList } from "./getPokemon"

describe("getPokemonList", () => {
    it("should get list", async () => {
        const pl = await getPokemonList();
        expect(pl).toBeDefined();
        expect(pl.results[0].name).toBe("bulbasaur");
    });
})