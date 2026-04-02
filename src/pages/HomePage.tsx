import { useState, useMemo, useCallback } from 'react'
import { usePokemonList } from '../hooks/usePokemonList'
import PokemonCard from '../components/PokemonCard'
import SearchBar from '../components/SearchBar'
import TypeFilter from '../components/TypeFilter'
import frenchNames from '../data/frenchNames.json'

const PAGE_SIZE = 48

export default function HomePage() {
  const { data: allPokemon, isLoading, isError } = usePokemonList()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!allPokemon) return []
    let list = allPokemon
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => {
        if (p.name.includes(q)) return true
        const id = p.url.split('/').filter(Boolean).pop()
        const frName = id ? (frenchNames as Record<string, string>)[id] : undefined
        return frName ? frName.toLowerCase().includes(q) : false
      })
    }
    return list
  }, [allPokemon, search])

  // For type filter we rely on the card's own data, so we slice after search
  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])

  const handleSearch = useCallback((v: string) => {
    setSearch(v)
    setPage(1)
  }, [])

  const handleTypeFilter = useCallback((t: string | null) => {
    setTypeFilter(t)
    setPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Poké Ball"
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Pokédex
            </h1>
            {allPokemon && (
              <span className="ml-auto text-xs text-gray-500">
                {filtered.length} Pokémon
              </span>
            )}
          </div>
          <SearchBar value={search} onChange={handleSearch} />
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-3 overflow-x-auto">
          <TypeFilter selected={typeFilter} onChange={handleTypeFilter} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">Erreur de connexion</p>
            <p className="text-sm">Impossible de charger les Pokémon. Vérifiez votre connexion Internet.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">😢</p>
            <p className="text-lg font-semibold">Aucun Pokémon trouvé</p>
            <p className="text-sm mt-1">Essayez un autre nom ou filtre.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <PokemonGrid items={paginated} typeFilter={typeFilter} />

            {paginated.length < filtered.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition"
                >
                  Charger plus
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function PokemonGrid({
  items,
  typeFilter,
}: {
  items: { name: string; url: string }[]
  typeFilter: string | null
}) {
  // When a type filter is active, we render all cards but hide non-matching ones
  // This is handled at the card level via CSS; for simplicity we show all and let
  // filtering happen via the PokemonCard's loaded data using a wrapper component
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map(p => (
        <FilteredCard key={p.name} name={p.name} url={p.url} typeFilter={typeFilter} />
      ))}
    </div>
  )
}

function FilteredCard({
  name,
  url,
  typeFilter,
}: {
  name: string
  url: string
  typeFilter: string | null
}) {
  // When no type filter, just render the card
  if (!typeFilter) {
    return <PokemonCard name={name} url={url} />
  }

  // With type filter: PokemonCard already fetches the data. We use a wrapper to
  // conditionally hide the card after it loads.
  return <TypeFilteredCard name={name} url={url} typeFilter={typeFilter} />
}

import { useQuery } from '@tanstack/react-query'
import type { Pokemon } from '../types/pokemon'

function TypeFilteredCard({
  name,
  url,
  typeFilter,
}: {
  name: string
  url: string
  typeFilter: string
}) {
  const { data } = useQuery<Pokemon>({
    queryKey: ['pokemon', name],
    queryFn: async () => {
      const res = await fetch(url)
      return res.json()
    },
    staleTime: Infinity,
  })

  // Not loaded yet — show skeleton so layout doesn't jump
  if (!data) return <div className="rounded-2xl bg-white/5 animate-pulse aspect-[3/4]" />

  const hasType = data.types.some(t => t.type.name === typeFilter)
  if (!hasType) return null

  return <PokemonCard name={name} url={url} />
}
