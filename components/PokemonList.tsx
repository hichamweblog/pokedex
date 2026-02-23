import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemons }: { pokemons: Pokemon[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
