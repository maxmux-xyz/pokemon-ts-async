// import fetch from "node-fetch";
import PromisePool from "@supercharge/promise-pool/dist";
import { Pokemon, PokemonList, getPokemon, getPokemonList } from "./src/getPokemon";

// interface PokemonList {
//     count: number;
//     next: string;
//     previous?: any;
//     results: {
//         name: string;
//         url: string;
//     }[];
// }

// interface Pokemon {
//     id: number;
//     name: string;
//     stats: {
//       base_stat: number;
//       effort: number;
//       stat: {
//         name: string;
//         url: string;
//       };
//     }[];
//   }

// const getPokemonList = async () : Promise<PokemonList> => {
//     const listResp= await fetch("https://pokeapi.co/api/v2/pokemon/");
//     return await listResp.json();
// }

// const getPokemon = async (url: string): Promise<Pokemon> => {
//     const dataResp = await fetch(url)
//     return await dataResp.json();
// }

const getFirstPokemon = async (): Promise<Pokemon> => 
    new Promise(async (resolve, reject) => {
        try {
            console.log("Getting list of poke");
            const list: PokemonList = await getPokemonList();
            resolve(await getPokemon(list.results[0].url));
        } catch (error) {
            reject(error);
        }
    });

(async function () {
    try {
        // const pokePromise = getFirstPokemon();
        // const pokemon: Pokemon = await pokePromise;
        // console.log(pokemon.name);
        // const pokemon1: Pokemon = await pokePromise;
        // console.log(pokemon1.name);
        const pokemon: Pokemon = await getFirstPokemon();
        console.log(pokemon.name);
        // const pokemon1: Pokemon = await getFirstPokemon();
        // console.log(pokemon1.name);
    } catch (e) {
        console.error(e);
    }
})();

(async function () {
    try {
        const pokeList: PokemonList = await getPokemonList();
        // @supercharge/promise-pool - Parallele, can limit to prevent overflow
        const {results, errors} = await PromisePool
            .withConcurrency(4)
            .for(pokeList.results)
            .process(async data => {
                return await getPokemon(data.url);
            });
        console.log(results.map(p => p.name));


        // Promise.all - Parallele, but can overflow
        // const data = await Promise.all(pokeList.results.map((pokemon) => getPokemon(pokemon.url)));
        // console.log(data);
        // console.log(">> DONE");
        
        // Reduce - sequential as well, won't overflow
        // pokeList.results.reduce<Promise<unknown>>(async (pr, pokemon) => {
        //     await pr;
        //     return getPokemon(pokemon.url).then((p) => console.log(p.name));
        // }, Promise.resolve(undefined));

        // For loop - sequential, won't overflow
        // for(const p of pokeList.results) {
        //     const pokemon: Pokemon = await getPokemon(p.url);
        //     console.log(pokemon.name);
        // }
        
        // foreach - sequiential, can overflow
        // pokeList.results.forEach(async (p) => {
        //     const pokemon: Pokemon = await getPokemon(p.url);
        //     console.log(pokemon.name);
        // });
    } catch (e) {
        console.error(e);
    }
})();
