export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
height: number;
weight: number;
base_experience: number;
abilities: Array<{
	ability: {
		name: string;
	};
	is_hidden: boolean;
}>;
stats: Array<{
	base_stat: number;
	stat: {
		name: string;
	};
}>;
moves: Array<{
	move: {
		name: string;
	};
}>;
species: {
	name: string;
	url: string;
};
cries: {
	latest: string;
	legacy: string;
};
}

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonResponse {
  pokemons: Pokemon[];
  total: number;
  next: string | null;
  previous: string | null;
}
