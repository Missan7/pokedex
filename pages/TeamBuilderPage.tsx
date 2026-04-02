import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePokemonList } from '../hooks/usePokemonList'
import SearchBar from '../components/SearchBar'
import TypeBadge from '../components/TypeBadge'
import { getTypeColor, getTypeLabel } from '../utils/typeColors'
import { getTypeEffectiveness } from '../utils/typeEffectiveness'
import frenchNames from '../data/frenchNames.json'
import type { Pokemon, ApiTypeName } from '../types/pokemon'

const MAX_TEAM_SIZE = 6

const ALL_TYPES: ApiTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

// --- Persistance localStorage ---
function loadTeamIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem('pokemon-team') ?? '[]')
  } catch {
    return []
  }
}

// --- Hook: charge un Pokémon par ID ---
function usePokemonById(id: number | null) {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', String(id)],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      return res.json()
    },
    staleTime: Infinity,
    enabled: id !== null,
  })
}

// --- Slot d'équipe ---
function TeamSlot({
  pokemonId,
  onRemove,
}: {
  pokemonId: number | null
  onRemove: () => void
}) {
  const { data, isLoading } = usePokemonById(pokemonId)
  const frName = data ? (frenchNames as Record<string, string>)[String(data.id)] ?? data.name : null
  const artwork = data?.sprites.other['official-artwork'].front_default ?? null

  if (pokemonId === null) {
    return (
      <div className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/3 text-white/20">
        <span className="text-3xl">+</span>
        <span className="text-xs mt-1">Vide</span>
      </div>
    )
  }

  if (isLoading || !data) {
    return <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
  }

  const primaryType = data.types[0]?.type.name ?? 'normal'
  const { bg } = getTypeColor(primaryType)

  return (
    <div
      className="relative flex flex-col items-center p-3 rounded-2xl border border-white/10 group"
      style={{ background: `linear-gradient(145deg, ${bg}22 0%, transparent 70%)` }}
    >
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/60 text-white/40 hover:text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        title="Retirer"
      >
        ✕
      </button>

      <Link to={`/pokemon/${data.id}`} className="flex flex-col items-center gap-1 w-full">
        <img
          src={artwork ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`}
          alt={frName ?? data.name}
          className="w-16 h-16 object-contain drop-shadow-md"
        />
        <span className="text-[10px] text-gray-400 font-mono">
          #{String(data.id).padStart(4, '0')}
        </span>
        <span className="text-xs font-semibold text-white text-center leading-tight truncate w-full text-center">
          {frName}
        </span>
        <div className="flex gap-1 flex-wrap justify-center">
          {data.types.map(t => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </Link>
    </div>
  )
}

// --- Analyse globale des types ---
function TeamAnalysis({ teamPokemons }: { teamPokemons: (Pokemon | undefined)[] }) {
  const loaded = teamPokemons.filter((p): p is Pokemon => !!p)

  if (loaded.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic text-center py-4">
        Ajoutez des Pokémon à votre équipe pour voir l'analyse.
      </p>
    )
  }

  // Pour chaque type attaquant, compter : faibles, résistants, immunisés
  const analysis = useMemo(() => {
    return ALL_TYPES.map(attackType => {
      let weak = 0
      let resistant = 0
      let immune = 0

      for (const pokemon of loaded) {
        const defendingTypes = pokemon.types.map(t => t.type.name)
        const effectiveness = getTypeEffectiveness(defendingTypes)

        if (effectiveness['0x'].includes(attackType)) {
          immune++
        } else if (effectiveness['4x'].includes(attackType) || effectiveness['2x'].includes(attackType)) {
          weak++
        } else if (effectiveness['0.25x'].includes(attackType) || effectiveness['0.5x'].includes(attackType)) {
          resistant++
        }
      }

      return { attackType, weak, resistant, immune }
    })
  }, [loaded])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {analysis.map(({ attackType, weak, resistant, immune }) => {
        const { bg } = getTypeColor(attackType)
        const label = getTypeLabel(attackType)
        const isProblematic = weak >= 3
        const isGood = resistant + immune >= 3

        return (
          <div
            key={attackType}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: `${bg}18`, border: `1px solid ${bg}30` }}
          >
            {/* Badge type */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0"
              style={{ backgroundColor: bg, color: '#fff' }}
            >
              {label}
            </span>

            {/* Compteurs */}
            <div className="flex items-center gap-1.5 ml-auto text-[11px] font-semibold">
              {weak > 0 && (
                <span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: isProblematic ? '#ef444433' : '#ffffff15',
                    color: isProblematic ? '#f87171' : '#9ca3af',
                  }}
                  title={`${weak} faible(s)`}
                >
                  ↑{weak}
                </span>
              )}
              {resistant > 0 && (
                <span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: isGood ? '#22c55e22' : '#ffffff10',
                    color: isGood ? '#4ade80' : '#9ca3af',
                  }}
                  title={`${resistant} résistant(s)`}
                >
                  ↓{resistant}
                </span>
              )}
              {immune > 0 && (
                <span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/10 text-gray-400"
                  title={`${immune} immunisé(s)`}
                >
                  ✕{immune}
                </span>
              )}
              {weak === 0 && resistant === 0 && immune === 0 && (
                <span className="text-gray-600 text-[10px]">—</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// --- Carte Pokémon dans le sélecteur ---
function SelectorCard({
  name,
  url,
  inTeam,
  teamFull,
  onAdd,
}: {
  name: string
  url: string
  inTeam: boolean
  teamFull: boolean
  onAdd: (id: number) => void
}) {
  const { data, isLoading } = useQuery<Pokemon>({
    queryKey: ['pokemon', name],
    queryFn: async () => {
      const res = await fetch(url)
      return res.json()
    },
    staleTime: Infinity,
  })

  if (isLoading || !data) {
    return <div className="h-14 rounded-xl bg-white/5 animate-pulse" />
  }

  const frName = (frenchNames as Record<string, string>)[String(data.id)] ?? data.name
  const sprite =
    data.sprites.other['official-artwork'].front_default ??
    data.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`

  const disabled = inTeam || teamFull

  return (
    <button
      onClick={() => !disabled && onAdd(data.id)}
      disabled={disabled}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition ${
        inTeam
          ? 'bg-indigo-500/20 border border-indigo-500/40 cursor-default'
          : teamFull
          ? 'opacity-40 cursor-not-allowed bg-white/5'
          : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15'
      }`}
    >
      <img src={sprite} alt={frName} className="w-10 h-10 object-contain shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{frName}</p>
        <p className="text-[10px] text-gray-500 font-mono">#{String(data.id).padStart(4, '0')}</p>
      </div>
      <div className="flex gap-1 ml-auto shrink-0">
        {data.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>
      {inTeam && (
        <span className="ml-2 text-indigo-400 text-xs shrink-0">✓</span>
      )}
    </button>
  )
}

// --- Page principale ---
export default function TeamBuilderPage() {
  const { data: allPokemon } = usePokemonList()
  const [teamIds, setTeamIds] = useState<number[]>(loadTeamIds)
  const [search, setSearch] = useState('')

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('pokemon-team', JSON.stringify(teamIds))
  }, [teamIds])

  // Charger les Pokémon de l'équipe
  const slot0 = usePokemonById(teamIds[0] ?? null)
  const slot1 = usePokemonById(teamIds[1] ?? null)
  const slot2 = usePokemonById(teamIds[2] ?? null)
  const slot3 = usePokemonById(teamIds[3] ?? null)
  const slot4 = usePokemonById(teamIds[4] ?? null)
  const slot5 = usePokemonById(teamIds[5] ?? null)
  const teamPokemons = [slot0.data, slot1.data, slot2.data, slot3.data, slot4.data, slot5.data]

  const addPokemon = (id: number) => {
    if (teamIds.length >= MAX_TEAM_SIZE || teamIds.includes(id)) return
    setTeamIds(prev => [...prev, id])
  }

  const removePokemon = (index: number) => {
    setTeamIds(prev => prev.filter((_, i) => i !== index))
  }

  // Filtrer la liste pour le sélecteur
  const filteredList = useMemo(() => {
    if (!allPokemon) return []
    const q = search.trim().toLowerCase()
    if (!q) return allPokemon.slice(0, 60) // Afficher 60 premiers si pas de recherche
    return allPokemon.filter(p => {
      if (p.name.includes(q)) return true
      const id = p.url.split('/').filter(Boolean).pop()
      const frName = id ? (frenchNames as Record<string, string>)[id] : undefined
      return frName ? frName.toLowerCase().includes(q) : false
    }).slice(0, 30)
  }, [allPokemon, search])

  const teamFull = teamIds.length >= MAX_TEAM_SIZE
  const slots: (number | null)[] = [
    teamIds[0] ?? null,
    teamIds[1] ?? null,
    teamIds[2] ?? null,
    teamIds[3] ?? null,
    teamIds[4] ?? null,
    teamIds[5] ?? null,
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Pokédex
          </Link>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Mon Équipe</h1>
          <span className="ml-auto text-xs text-gray-500">
            {teamIds.length} / {MAX_TEAM_SIZE}
          </span>
          {teamIds.length > 0 && (
            <button
              onClick={() => setTeamIds([])}
              className="text-xs text-red-400/70 hover:text-red-400 transition"
            >
              Tout effacer
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Grille des 6 slots */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Équipe
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {slots.map((id, index) => (
              <TeamSlot
                key={index}
                pokemonId={id}
                onRemove={() => removePokemon(index)}
              />
            ))}
          </div>
        </section>

        {/* Analyse des types */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Analyse des types
          </h2>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex gap-4 text-[11px] text-gray-500 mb-3">
              <span><span className="text-red-400 font-bold">↑N</span> = N membres faibles</span>
              <span><span className="text-green-400 font-bold">↓N</span> = N membres résistants</span>
              <span><span className="text-gray-400 font-bold">✕N</span> = N membres immunisés</span>
            </div>
            <TeamAnalysis teamPokemons={teamPokemons} />
          </div>
        </section>

        {/* Sélecteur */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Ajouter un Pokémon {teamFull && <span className="text-yellow-500 normal-case">(équipe complète)</span>}
          </h2>
          <div className="mb-3">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          {!search.trim() && (
            <p className="text-xs text-gray-600 mb-2">
              Recherchez un Pokémon par nom français ou anglais pour l'ajouter à votre équipe.
            </p>
          )}
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {filteredList.map(p => (
              <SelectorCard
                key={p.name}
                name={p.name}
                url={p.url}
                inTeam={(() => {
                  const id = p.url.split('/').filter(Boolean).pop()
                  return id ? teamIds.includes(parseInt(id)) : false
                })()}
                teamFull={teamFull}
                onAdd={addPokemon}
              />
            ))}
            {filteredList.length === 0 && search.trim() && (
              <p className="text-sm text-gray-500 italic text-center py-4">Aucun résultat.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
