import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Link
      href={`/${pokemon.id}`}
      className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm mx-auto hover:scale-105 transition-transform duration-200 block">
      <div className="grid grid-cols-1 gap-2 justify-items-center mb-4">
        <Image
          src={
            pokemon.sprites.other["official-artwork"].front_default ??
            "https://placehold.net/400x400.png"
          }
          alt={pokemon.name}
          width={200}
          height={200}
          className="h-50 w-52 object-contain"
        />
        <div>
          <h2 className="text-xl text-center text-rose-900 font-bold capitalize">
            {pokemon.name}
          </h2>
          <p className="text-gray-500 text-center">
            Type: {pokemon.types.map((type) => type.type.name).join("/")}
          </p>
        </div>
      </div>
    </Link>
  );
}
