import type {
  Pokemon,
  PokemonListResult,
  PokemonResponse,
} from "@/types/pokemon";

export async function fetchPokemonList(
  offset: number = 0,
  limit: number = 20,
  search: string = "",
): Promise<PokemonResponse> {
  // When searching, fetch all pokemon to filter across the full list
  const url = search
    ? `https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000`
    : `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data: {
    results: PokemonListResult[];
    count: number;
    next: string | null;
    previous: string | null;
  } = await response.json();

  if (search) {
    const filteredResults = data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()),
    );
    data.results = filteredResults;
    data.count = filteredResults.length;
    data.next = null;
    data.previous = null;
  }
  const pokemonData: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ${pokemon.name}`);
      }
      return res.json() as Promise<Pokemon>;
    }),
  );

  return {
    pokemons: pokemonData,
    total: data.count,
    next: data.next,
    previous: data.previous,
  };
}

// Helper to fetch directly by next/previous URL
export async function fetchPokemonByUrl(url: string): Promise<PokemonResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data: {
    results: PokemonListResult[];
    count: number;
    next: string | null;
    previous: string | null;
  } = await response.json();

  const pokemonData: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ${pokemon.name}`);
      }
      return res.json() as Promise<Pokemon>;
    }),
  );

  return {
    pokemons: pokemonData,
    total: data.count,
    next: data.next,
    previous: data.previous,
  };
}
export async function fetchPokemon(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon: ${id}`);
  return res.json();
}
