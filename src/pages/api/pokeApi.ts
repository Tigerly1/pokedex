import type { Pokemon, PokemonData } from "../../types/pokemon";

export const fetchPokemonData = async (url: string): Promise<PokemonData> => {
  const response = await fetch(url);
  const json = await response.json();

  const sprites = json.sprites.versions["generation-v"]["black-white"];
  const types = json.types.map(
    (item: { type: { name: string } }) => item.type.name
  );
  const abilities = json.abilities.map(
    (item: { ability: { name: string } }) => item.ability.name
  );
  const stats = Object.fromEntries(
    json.stats.map((item: { base_stat: number; stat: { name: string } }) => [
      item.stat.name,
      item.base_stat,
    ])
  );

  return {
    id: json.id,
    name: json.name,
    url: url,
    imageUrl: sprites["front_default"],
    gifUrl: sprites["animated"]["front_default"],
    types: types,
    abilities: abilities,
    height: json.height,
    weight: json.weight,
    stats: {
      hp: stats["hp"],
      attack: stats["attack"],
      defense: stats["defense"],
      speed: stats["speed"],
    },
  };
};

export const fetchPokemonDescription = async (id: number): Promise<string> => {
  const json = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .then((response) => response.json())
    .catch((error) => console.log("Fetch pokemons failed: " + error));

  if (json) {
    for (const element of json.flavor_text_entries) {
      if (element.language.name === "en") {
        const s = element.flavor_text.split("\n").join(" ");
        return s;
      }
    }
  }
  return "...";
};

export const fetchPokemons = async (
  limit: number,
  offset: number
): Promise<PokemonData[]> => {
  const json = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  )
    .then((response) => response.json())
    .catch((error) => console.log("Fetch pokemons failed: " + error));

  if (!json) return [];

  const pokemonList = await Promise.all<PokemonData>(
    json.results.map((item: Pokemon) => fetchPokemonData(item.url))
  ).catch((error) => {
    console.log("Fetch pokemons data failed: " + error);
    return [];
  });

  // console.log(pokemonList.map((item: any) => item.id));
  // console.log(pokemonList[0]);

  return pokemonList;
}; import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
