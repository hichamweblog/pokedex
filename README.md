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

### 5. `searchParams` — URL-driven State (Deep Dive)

#### What is URL-driven State?

It means using the **URL itself as your state**. Instead of storing values like the current page or search query in React's `useState`, you store them in the URL as query parameters.

```
❌  useState approach:  const [page, setPage] = useState(1)
✅  URL-driven:         http://localhost:3000/?offset=20
```

The URL `/?offset=20&search=bulba` contains all the information needed to render the page. The server reads it, fetches the right data, and returns the correct HTML — no client-side state involved.

---

#### Mental model: the Request/Response cycle

```
User clicks "Next Page"
        ↓
<a href="/?offset=20">      ← just a link, no JS needed
        ↓
Browser navigates to /?offset=20
        ↓
Next.js Server Component receives searchParams = { offset: "20" }
        ↓
Server fetches page 2 from PokéAPI
        ↓
Returns fully-rendered HTML with page 2 data
```

Nothing is stored in memory. Every render is deterministic: same URL → same output.

---

#### Why is it better than `useState`?

|                          | `useState` + `useEffect`                          | URL-driven state                                           |
| ------------------------ | ------------------------------------------------- | ---------------------------------------------------------- |
| **Shareable links**      | ❌ State is lost if you share the URL             | ✅ `/?search=pikachu&offset=40` opens exactly what you see |
| **Browser back/forward** | ❌ Back button doesn't restore filters            | ✅ Browser history works naturally                         |
| **Refresh**              | ❌ State resets to defaults                       | ✅ Page reloads with the same data                         |
| **Bookmarks**            | ❌ Doesn't work                                   | ✅ Bookmark any page/search                                |
| **SEO**                  | ❌ Server has no idea what to render              | ✅ Crawlers see real content per URL                       |
| **Complexity**           | Higher — needs hydration, loading states, effects | Lower — just read params and fetch                         |
| **Client JS**            | Required                                          | Not required (server renders it all)                       |

---

#### How it works in this project

**Reading params (Server Component — zero JS sent to browser):**

```tsx
// app/page.tsx
interface PageProps {
  searchParams: Promise<{ offset?: string; search?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { offset, search } = await searchParams;
  //  ↑ Next.js injects these from the URL automatically

  const data = await fetchPokemonList(
    offset ? parseInt(offset) : 0, // /?offset=40  → page 3
    20,
    search ?? "", // /?search=bulba → filter
  );
}
```

**Changing state (update the URL, trigger a re-render):**

```tsx
// Pagination.tsx — plain HTML anchor, no JS
<a href={`/?offset=${nextOffset}`}>Next</a>;

// InputSearch.tsx — needs router for programmatic navigation
("use client");
const router = useRouter();
router.push(`/?search=${encodeURIComponent(value)}`);
// ↑ this changes the URL → Next.js re-runs the Server Component
```

When the URL changes, Next.js automatically re-runs the Server Component with the new `searchParams`, fetches fresh data, and streams the new HTML — no `useState`, no `useEffect`, no loading spinners needed.

---

#### How to implement it in any Next.js project

**Step 1 — Define what your state looks like as URL params:**

```
Pagination   →  ?offset=20 or ?page=2
Filters      →  ?category=fire&generation=1
Sorting      →  ?sort=name&order=asc
Search       →  ?search=pikachu
Tab          →  ?tab=stats
```

**Step 2 — Read params in your Server Component:**

```tsx
// Any app/page.tsx or app/[segment]/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
  }>;
}) {
  const { page = "1", sort = "name", category } = await searchParams;

  const data = await fetchItems({
    page: parseInt(page),
    sort,
    category,
  });

  return <ItemList items={data} />;
}
```

**Step 3 — Update the URL to change state:**

```tsx
// Option A: Server Component — use plain <a> or <Link>
<Link href={`?page=${currentPage + 1}`}>Next</Link>;

// Option B: Client Component — use useRouter for programmatic changes
("use client");
import { useRouter, useSearchParams } from "next/navigation";

function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
    //  ↑ preserves existing params, only changes "sort"
  };

  return <select onChange={(e) => handleSort(e.target.value)} />;
}
```

> **Tip:** Always use `new URLSearchParams(searchParams.toString())` when updating params so you don't accidentally wipe other existing params (e.g. don't lose `?search=pikachu` when changing the sort).

**Step 4 — Show the current state to the user** (highlight active sort, fill search input, etc.):

```tsx
"use client";
const searchParams = useSearchParams();
const currentSort = searchParams.get("sort") ?? "name";

// In InputSearch — pre-fill input with current search
<input defaultValue={searchParams.get("search") ?? ""} />;
```

---

#### Rule of thumb

> If the user could reasonably **share, bookmark, or refresh** the page and expect to see the same thing — it belongs in the URL, not in `useState`.

Good candidates for URL state:

- Current page / offset
- Search query
- Active filters (type, category, tag)
- Sort order
- Active tab (if tabs show different data)

Stay in `useState` for:

- UI-only state (modal open/closed, tooltip visible)
- Form input values before submission
- Temporary animation state

---

> In Next.js 15+, `searchParams` is a **Promise** and must be awaited before reading its values.

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

### 11. Error Handling — `error.tsx` & `not-found.tsx`

Next.js App Router provides two dedicated files for error handling that wrap their route segment in an automatic React error boundary.

#### `error.tsx` — Runtime Errors

Shown when a Server Component throws during rendering or data fetching. Must be a **Client Component** (`"use client"`) because it receives the `error` object and a `reset` callback as props.

```tsx
// app/[pokemonId]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // re-attempts rendering the segment
}) {
  return (
    <div>
      <h1>Failed to load Pokémon</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Scoping:** `error.tsx` is segment-scoped. `app/[pokemonId]/error.tsx` only catches errors thrown inside the `[pokemonId]` segment. `app/error.tsx` catches errors from the home page. They do **not** catch errors in `layout.tsx` of the same segment (would need a parent `error.tsx`).

#### `not-found.tsx` — 404 Errors

Shown when `notFound()` is called from `next/navigation`. Used to distinguish a missing resource (404) from an unexpected crash.

```ts
// utils/fetchData.ts
import { notFound } from "next/navigation";

export async function fetchPokemon(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (res.status === 404) notFound(); // → renders not-found.tsx
  if (!res.ok) throw new Error("..."); // → renders error.tsx
  return res.json();
}
```

```tsx
// app/[pokemonId]/not-found.tsx  (no "use client" needed)
export default function NotFound() {
  return <h1>Pokémon Not Found</h1>;
}
```

| File            | Triggered by           | Must be client? |
| --------------- | ---------------------- | --------------- |
| `error.tsx`     | `throw new Error(...)` | Yes             |
| `not-found.tsx` | `notFound()`           | No              |

This project has both scoped (`app/[pokemonId]/`) and global (`app/`) versions of each file.

---

### 12. Loading UI — `loading.tsx`

Next.js automatically wraps each `page.tsx` in a React `<Suspense>` boundary. While the Server Component is fetching data, the nearest `loading.tsx` is shown instantly — no manual `useState` or spinner logic needed.

```tsx
// app/loading.tsx  — shown while Home page fetches pokemon list
export default function Loading() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse bg-white/20 rounded-lg" />
      ))}
    </div>
  );
}
```

**How it works:**

```
User navigates to /25
       ↓
Next.js streams loading.tsx immediately (skeleton UI)
       ↓
Server fetches Pokémon data in the background
       ↓
Next.js swaps loading.tsx → page.tsx content
```

This project has two loading skeletons:

- [app/loading.tsx](app/loading.tsx) — pulse grid of 20 card skeletons for the home list
- [app/[pokemonId]/loading.tsx](app/[pokemonId]/loading.tsx) — skeleton matching the detail page layout (header card, stat bars, ability rows)

> `loading.tsx` does **not** need `"use client"` — it's a plain Server Component shown synchronously before any async work begins.

---

### 13. Caching — How Next.js 16 Caches Data and Routes

Next.js 16 has **four distinct cache layers**, each with its own scope, lifetime, and purpose. Understanding them is key to building fast, predictable applications.

---

#### The Four Cache Layers

| Cache                   | Scope                      | Lives in          | Duration                                     | What it stores                                          |
| ----------------------- | -------------------------- | ----------------- | -------------------------------------------- | ------------------------------------------------------- |
| **Request Memoization** | Single render pass         | Server memory     | Cleared after render                         | Deduplicates identical `fetch` calls within one request |
| **Data Cache**          | All requests & deployments | Server (disk/CDN) | Persistent (until revalidated)               | The raw response of `fetch` calls                       |
| **Full Route Cache**    | All requests               | Server (disk/CDN) | Persistent (until revalidated or redeployed) | Rendered HTML + RSC payload of static routes            |
| **Router Cache**        | Current browser session    | Client memory     | Session / time-based                         | RSC payloads of visited and prefetched routes           |

---

#### Important: Default Behaviour Changed in Next.js 15+

This is the most common source of confusion when upgrading:

| Version           | Default `fetch` behaviour                         |
| ----------------- | ------------------------------------------------- |
| Next.js 13/14     | `force-cache` — everything cached by default      |
| **Next.js 15/16** | **`no-store` — nothing cached unless you opt in** |

In this project (Next.js 16), every `fetch` call without a `cache` option hits the network on every request. This was fixed intentionally — see below.

---

#### 1. Request Memoization

React automatically deduplicates identical `fetch(url)` calls made during the **same render pass**. If two Server Components both call `fetchPokemon("pikachu")`, only one network request is made.

```ts
// Called in Layout and in Page — only ONE network request is made
const pokemon = await fetchPokemon("pikachu"); // MISS → fetches
const pokemon = await fetchPokemon("pikachu"); // HIT → returns cached
```

- **Automatic** — no configuration needed
- **Resets** after each request completes
- Only applies to `GET` requests within the React component tree
- Does **not** apply to Route Handlers

---

#### 2. Data Cache

The Data Cache is a **persistent server-side cache** that survives across multiple requests and deployments. It stores the raw responses of `fetch` calls.

**Opt in with `force-cache`:**

```ts
const res = await fetch(url, { cache: "force-cache" });
```

The first request fetches from the network and writes to the cache. Every subsequent request — from any user, at any time — reads from the cache without hitting the network.

**Opt in with time-based revalidation (`next.revalidate`):**

```ts
// Re-fetch at most once per hour (stale-while-revalidate)
const res = await fetch(url, { next: { revalidate: 3600 } });
```

- Cached data is returned instantly
- After the interval, the _next_ request gets stale data while Next.js re-fetches in the background
- Once fresh data is ready, it replaces the stale entry

**Opt out with `no-store`:**

```ts
const res = await fetch(url, { cache: "no-store" });
// or simply omit the cache option in Next.js 15+
const res = await fetch(url);
```

**Tag-based invalidation:**

```ts
// Tag a fetch response
const res = await fetch(url, { next: { tags: ["pokemon-list"] } });

// Invalidate all responses tagged "pokemon-list" on-demand
import { revalidateTag } from "next/cache";
revalidateTag("pokemon-list");
```

---

#### 3. Full Route Cache

When a route is **statically rendered**, Next.js caches the entire rendered output (HTML + RSC payload) on the server. Subsequent requests are served from this cache — no re-rendering.

**What makes a route static vs dynamic?**

| Condition                                 | Rendering                              |
| ----------------------------------------- | -------------------------------------- |
| No dynamic APIs used                      | Static — cached in Full Route Cache    |
| Uses `searchParams`, `cookies`, `headers` | Dynamic — rendered on every request    |
| Uses `fetch` with `no-store`              | Dynamic — opts out of Full Route Cache |
| Uses `dynamic = 'force-dynamic'`          | Dynamic — always re-rendered           |

**In this project:**

```
app/page.tsx          → DYNAMIC (uses searchParams for offset + search)
app/[pokemonId]/page.tsx → STATIC  (only uses params, which is pre-rendered)
```

Because `app/page.tsx` reads `searchParams`, Next.js automatically treats it as dynamic. The route is re-rendered on every request, but the **Data Cache** still prevents redundant network calls.

The Full Route Cache is cleared on each new deployment. It can also be cleared by revalidating the Data Cache via `revalidatePath()` or `revalidateTag()`.

---

#### 4. Client-side Router Cache

When a user navigates between pages, Next.js stores the RSC payload of each visited route segment in the browser's memory. This enables:

- **Instant back/forward navigation** — no server round-trip
- **Partial rendering** — only the changed segments re-render; shared layouts are reused
- **Prefetching** — `<Link>` components prefetch visible routes in the background

**Duration:**

| Segment type  | Cache duration                                                      |
| ------------- | ------------------------------------------------------------------- |
| Layouts       | Cached for the session                                              |
| Static pages  | 5 minutes                                                           |
| Dynamic pages | Not cached (in Next.js 15+, page segments are opted out by default) |

Cleared on `router.refresh()` or full page reload.

---

#### How the Caches Interact

```
Request arrives
      ↓
  Full Route Cache? → HIT → return cached HTML immediately
      ↓ MISS
  Render Server Components
      ↓
  Data Cache? → HIT → return cached fetch response
      ↓ MISS
  Fetch from network → store in Data Cache
      ↓
  Memoization deduplicates identical fetches in same render
      ↓
  Cache rendered output in Full Route Cache (if static route)
      ↓
  Send HTML to browser → stored in Router Cache for navigation
```

> Invalidating the Data Cache (via `revalidatePath` / `revalidateTag`) also invalidates the Full Route Cache for affected routes, since the rendered output depends on the data.

---

#### How Caching Is Implemented in This Project

Every `fetch` call in [utils/fetchData.ts](utils/fetchData.ts) uses `{ cache: "force-cache" }`:

```ts
// List fetch (paginated)
const response = await fetch(url, { cache: "force-cache" });

// Individual Pokémon detail fetches (inside Promise.all)
const res = await fetch(pokemon.url, { cache: "force-cache" });

// Single Pokémon for detail page
const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
  cache: "force-cache",
});
```

**Why `force-cache` is ideal here:** PokéAPI data never changes. There is no reason to re-fetch the same Pokémon data across requests. The cache persists until the app is redeployed.

**The search path is the most important one to cache.** Without caching, every search request fetches all 100,000+ Pokémon from the network. With `force-cache`, that happens only once — ever.

```ts
// When search is active, this URL fetches ALL Pokémon (~100k entries)
const url = search
  ? `https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000`
  : `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

const response = await fetch(url, { cache: "force-cache" }); // ← critical
```

**`generateStaticParams` on the detail page** pre-renders the first 151 Pokémon at build time, storing them in the Full Route Cache:

```ts
// app/[pokemonId]/page.tsx
export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    cache: "force-cache",
  });
  const data: { results: { name: string }[] } = await res.json();
  return data.results.map((p) => ({ pokemonId: p.name }));
}
```

- Gen 1 Pokémon are **pre-rendered at build time** — served as static HTML, no server rendering needed
- All other Pokémon are **rendered on first visit** and then cached automatically

---

#### Caching Decision Tree

```
Is the data static / never changes?
  └─ Yes → force-cache (cache forever, cleared on redeploy)

Does the data change occasionally?
  └─ Yes → next: { revalidate: N } (stale-while-revalidate every N seconds)

Does the data change in response to user actions?
  └─ Yes → revalidateTag() or revalidatePath() from a Server Action

Must the data always be fresh per-request?
  └─ Yes → no-store (or omit cache option in Next.js 15+)
```

---

## Project Structure

```
app/
├── globals.css             Global styles (Tailwind base)
├── layout.tsx              Root layout — shared across all pages
├── page.tsx                Home page — Pokémon list + search + pagination
├── loading.tsx             Home page skeleton (Suspense)
├── error.tsx               Home page error boundary ("use client")
├── not-found.tsx           Global 404 page
└── [pokemonId]/
    ├── page.tsx            Pokémon detail page — stats, abilities, moves
    ├── loading.tsx         Detail page skeleton (Suspense)
    ├── error.tsx           Detail page error boundary ("use client")
    └── not-found.tsx       Pokémon-specific 404 page

components/
├── InputSearch.tsx         "use client" — search input with router navigation
├── Pagination.tsx          Server component — previous/next page links
├── PokemonCard.tsx         Card with Link to detail page
└── PokemonList.tsx         Grid of PokemonCard components

utils/
└── fetchData.ts            All PokéAPI fetch helpers (notFound + throw)

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

| Concept           | Where used                                                   |
| ----------------- | ------------------------------------------------------------ |
| Server Components | `app/page.tsx`, `app/[pokemonId]/page.tsx`                   |
| Client Components | `components/InputSearch.tsx`, `error.tsx` files              |
| Dynamic Routes    | `app/[pokemonId]/page.tsx`                                   |
| `searchParams`    | `app/page.tsx` — offset & search                             |
| `params`          | `app/[pokemonId]/page.tsx` — pokemon id                      |
| `next/image`      | `PokemonCard`, detail page                                   |
| `next/link`       | `PokemonCard`, detail page back button                       |
| `next/navigation` | `InputSearch` — `useRouter`, `useSearchParams`, `notFound()` |
| Root Layout       | `app/layout.tsx` — metadata, fonts, global CSS               |
| Server-side fetch | `utils/fetchData.ts`                                         |
| Error Boundaries  | `error.tsx` (runtime), `not-found.tsx` (404) — both scopes   |
| Loading UI        | `loading.tsx` — Suspense skeletons for both routes           |
| Data Cache        | `fetch` with `force-cache` in `utils/fetchData.ts`           |
| Full Route Cache  | `generateStaticParams` in `app/[pokemonId]/page.tsx`         |
| Router Cache      | `<Link>` prefetching across all navigation                   |
