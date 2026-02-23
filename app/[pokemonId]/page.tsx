import { fetchPokemon } from "@/utils/fetchData";
import Image from "next/image";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-orange-400",
  water: "bg-blue-400",
  grass: "bg-green-400",
  electric: "bg-yellow-300",
  ice: "bg-cyan-300",
  fighting: "bg-red-600",
  poison: "bg-purple-400",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-400",
  bug: "bg-lime-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-violet-600",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
  normal: "bg-gray-300",
};

const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-400",
  attack: "bg-orange-400",
  defense: "bg-yellow-400",
  "special-attack": "bg-blue-400",
  "special-defense": "bg-green-400",
  speed: "bg-pink-400",
};

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    cache: "force-cache",
  });
  const data: { results: { name: string }[] } = await res.json();
  return data.results.map((p) => ({ pokemonId: p.name }));
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ pokemonId: string }>;
}) {
  const { pokemonId } = await params;
  const pokemon = await fetchPokemon(pokemonId);

  const image = pokemon.sprites.other["official-artwork"].front_default;
  const types = pokemon.types.map((t) => t.type.name);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors font-medium">
          ← Back to Pokédex
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8 mb-6 shadow-xl">
          <div className="relative w-52 h-52 shrink-0">
            <Image
              src={image ?? "https://placehold.co/200x200.png"}
              alt={pokemon.name}
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-rose-400 text-sm font-mono mb-1">
              #{String(pokemon.id).padStart(4, "0")}
            </p>
            <h1 className="text-4xl font-extrabold capitalize mb-3 text-rose-900">
              {pokemon.name}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
              {types.map((type) => (
                <span
                  key={type}
                  className={`${TYPE_COLORS[type] ?? "bg-gray-500"} text-white text-xs font-semibold px-3 py-1 rounded-full capitalize`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-rose-50 rounded-xl p-3">
                <p className="text-rose-400 text-xs mb-1">Height</p>
                <p className="font-bold text-lg text-rose-900">
                  {pokemon.height / 10}m
                </p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3">
                <p className="text-rose-400 text-xs mb-1">Weight</p>
                <p className="font-bold text-lg text-rose-900">
                  {pokemon.weight / 10}kg
                </p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3">
                <p className="text-rose-400 text-xs mb-1">Base XP</p>
                <p className="font-bold text-lg text-rose-900">
                  {pokemon.base_experience}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Base Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-rose-900">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((s) => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-rose-400">
                      {s.stat.name}
                    </span>
                    <span className="font-semibold text-rose-900">
                      {s.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-rose-100 rounded-full h-2">
                    <div
                      className={`${STAT_COLORS[s.stat.name] ?? "bg-rose-400"} h-2 rounded-full transition-all`}
                      style={{
                        width: `${Math.min((s.base_stat / 255) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-rose-900">Abilities</h2>
            <div className="space-y-2">
              {pokemon.abilities.map((a) => (
                <div
                  key={a.ability.name}
                  className="flex items-center justify-between bg-rose-50 rounded-xl px-4 py-3">
                  <span className="capitalize font-medium text-rose-900">
                    {a.ability.name}
                  </span>
                  {a.is_hidden && (
                    <span className="text-xs bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Cries */}
            {pokemon.cries?.latest && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-3 text-rose-900">Cry</h2>
                <audio controls className="w-full accent-rose-500">
                  <source src={pokemon.cries.latest} type="audio/ogg" />
                </audio>
              </div>
            )}
          </div>
        </div>

        {/* Moves */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mt-6">
          <h2 className="text-lg font-bold mb-4 text-rose-900">
            Moves{" "}
            <span className="text-rose-400 text-sm font-normal">
              ({pokemon.moves.length} total)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.moves.slice(0, 20).map((m) => (
              <span
                key={m.move.name}
                className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full capitalize">
                {m.move.name}
              </span>
            ))}
            {pokemon.moves.length > 20 && (
              <span className="text-rose-400 text-xs px-3 py-1">
                +{pokemon.moves.length - 20} more
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
