"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function InputSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value.trim();
    if (value) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/");
    }
  };

  const handleClear = () => {
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto relative mb-12">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name="search"
        defaultValue={currentSearch}
        placeholder="Search Pokémon..."
        className="w-full bg-rose-100 p-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-rose-600 text-rose-900"
      />
      {currentSearch && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      )}
    </form>
  );
}
