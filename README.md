# Pokédex — Next.js Educational Project

A Pokédex application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, consuming the [PokéAPI](https://pokeapi.co). This project is designed to demonstrate core Next.js App Router features in a real-world context.

---

## Tech Stack

| Tool         | Version |
| ------------ | ------- |
| Next.js      | 16.x    |
| React        | 19.x    |
| TypeScript   | 5.x     |
| Tailwind CSS | 4.x     |
| Lucide React | icons   |

---

## Next.js Features Used

### 1. App Router

This project uses the **App Router** (`app/` directory), introduced in Next.js 13 and stable since 14. Every file named `page.tsx` inside `app/` automatically becomes a route.

```
app/
├── layout.tsx          → Root layout (applies to all routes)
├── page.tsx            → Home route  /
└── [pokemonId]/
    └── page.tsx        → Dynamic route  /1, /25, /bulbasaur
```

---

### 2. Server Components (default)

All components in the App Router are **React Server Components (RSC)** by default. They run only on the server — no JavaScript is sent to the browser, and they can be `async`.

```tsx
// app/page.tsx
export default async function Home({ searchParams }) {
  const data = await fetchPokemonList(...); // runs on the server
  return <PokemonList pokemons={data.pokemons} />;
}
```

**Benefits:**

- Data fetching happens before the HTML is sent to the browser
- No loading spinners needed for initial data
- Reduced client-side bundle size

---

### 3. Client Components

When a component needs browser APIs, event listeners, or React hooks (`useState`, `useEffect`, `useRouter`, etc.), it must opt in with the `"use client"` directive.

```tsx
// components/InputSearch.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function InputSearch() {
  const router = useRouter();
  // ...
}
```

> **Rule of thumb:** Keep components as Server Components unless they need interactivity or browser APIs.

---

### 4. Dynamic Routes

The file `app/[pokemonId]/page.tsx` creates a **dynamic segment**. The bracket syntax `[pokemonId]` means that `/1`, `/pikachu`, `/charizard` all match this route.

```tsx
// app/[pokemonId]/page.tsx
export default async function PokemonPage({
  params,
}: {
  params: Promise<{ pokemonId: string }>;
}) {
  const { pokemonId } = await params; // "25", "pikachu", etc.
  const pokemon = await fetchPokemon(pokemonId);
}
```

> In Next.js 15+, `params` is a **Promise** and must be awaited.

---

### 5. `searchParams` for URL-driven State

The home page reads `searchParams` to handle pagination and search **without any client-side state**. The URL is the single source of truth.

```tsx
// app/page.tsx
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
}
```

- `/?offset=20` → page 2
- `/?search=bulba` → filtered results
- No `useState`, no `useEffect`, no client JS required

> `searchParams` is also a **Promise** in Next.js 15+ and must be awaited.

---

### 6. `next/image` — Optimised Image Component

Instead of a plain `<img>` tag, this project uses Next.js's built-in `<Image>` component, which provides:

- **Automatic WebP/AVIF conversion**
- **Lazy loading** by default
- **Prevents layout shift** (requires `width`/`height` or `fill`)
- Serves images via Next.js's image optimisation pipeline

```tsx
import Image from "next/image";

<Image
  src={pokemon.sprites.other["official-artwork"].front_default}
  alt={pokemon.name}
  width={200}
  height={200}
/>;
```

Remote image domains must be explicitly allowed in `next.config.ts`:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};
```

---

### 7. `next/link` — Client-side Navigation

`<Link>` enables **client-side navigation** between pages without a full browser reload. It also **prefetches** linked pages in the background when they appear in the viewport.

```tsx
import Link from "next/link";

// Navigate to a pokemon detail page
<Link href={`/${pokemon.id}`}>View Details</Link>

// Navigate back
<Link href="/">← Back to Pokédex</Link>
```

---

### 8. `next/navigation` — Programmatic Navigation

Used in the `InputSearch` client component to navigate programmatically on form submit.

```tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

const router = useRouter();
const searchParams = useSearchParams();

// Push a new URL and trigger a server re-render with new searchParams
router.push(`/?search=${encodeURIComponent(value)}`);
```

| Hook                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `useRouter()`       | Programmatic navigation (`push`, `replace`, `back`) |
| `useSearchParams()` | Read current URL query params on the client         |

---

### 9. Root Layout

`app/layout.tsx` wraps every page in the app. It's the right place for global styles, fonts, metadata, and shared UI like navbars.

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "Pokédex",
  description: "A simple Pokédex application built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

### 10. Server-side Data Fetching (fetch)

Next.js extends the native `fetch` API with **automatic caching and deduplication**. Fetch calls in Server Components run at build time or request time depending on the cache configuration.

```ts
// utils/fetchData.ts
export async function fetchPokemonList(offset = 0, limit = 20, search = "") {
  const url = search
    ? `https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000`
    : `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  // ...
}
```

---

## Project Structure

```
app/
├── globals.css             Global styles (Tailwind base)
├── layout.tsx              Root layout — shared across all pages
├── page.tsx                Home page — Pokémon list + search + pagination
└── [pokemonId]/
    └── page.tsx            Pokémon detail page — stats, abilities, moves

components/
├── InputSearch.tsx         "use client" — search input with router navigation
├── Pagination.tsx          Server component — previous/next page links
├── PokemonCard.tsx         Card with Link to detail page
└── PokemonList.tsx         Grid of PokemonCard components

utils/
└── fetchData.ts            All PokéAPI fetch helpers

types/
└── pokemon.ts              TypeScript interfaces for API responses
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Concepts Summary

| Concept           | Where used                                     |
| ----------------- | ---------------------------------------------- |
| Server Components | `app/page.tsx`, `app/[pokemonId]/page.tsx`     |
| Client Components | `components/InputSearch.tsx`                   |
| Dynamic Routes    | `app/[pokemonId]/page.tsx`                     |
| `searchParams`    | `app/page.tsx` — offset & search               |
| `params`          | `app/[pokemonId]/page.tsx` — pokemon id        |
| `next/image`      | `PokemonCard`, detail page                     |
| `next/link`       | `PokemonCard`, detail page back button         |
| `next/navigation` | `InputSearch` — `useRouter`, `useSearchParams` |
| Root Layout       | `app/layout.tsx` — metadata, fonts, global CSS |
| Server-side fetch | `utils/fetchData.ts`                           |
