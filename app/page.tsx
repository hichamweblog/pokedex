import InputSearch from "@/components/InputSearch";
import Pagination from "@/components/Pagination";
import PokemonList from "@/components/PokemonList";
import { fetchPokemonList } from "@/utils/fetchData";

interface PageProps {
  searchParams: Promise<{ offset?: string; search?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { offset, search } = await searchParams;

  const data = await fetchPokemonList(
    offset ? parseInt(offset) : 0,
    20,
    search ?? "",
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center mb-8">Pokédex</h1>
      <InputSearch />
      <PokemonList pokemons={data.pokemons} />
      {!search && (
        <Pagination
          next={data.next}
          previous={data.previous}
          total={data.total}
          currentOffset={offset ? parseInt(offset) : 0}
        />
      )}
    </main>
  );
}
