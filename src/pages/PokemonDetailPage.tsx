import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePokemon, usePokemonSpecies, useEvolutionChain } from '../hooks/usePokemon'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import TypeEffectiveness from '../components/TypeEffectiveness'
import { getTypeColor } from '../utils/typeColors'
import type { EvolutionChainLink } from '../types/pokemon'

function padId(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

function cmToM(height: number) {
  const m = height / 10
  return `${m.toFixed(1)} m`
}

function kgToKg(weight: number) {
  const kg = weight / 10
  return `${kg.toFixed(1)} kg`
}

function getFrenchName(species: { names: Array<{ name: string; language: { name: string } }> }) {
  return (
    species.names.find(n => n.language.name === 'fr')?.name ??
    species.names.find(n => n.language.name === 'en')?.name ??
    ''
  )
}

function getFrenchFlavorText(
  entries: Array<{ flavor_text: string; language: { name: string } }>
) {
  const fr = entries.find(e => e.language.name === 'fr')
  return (fr?.flavor_text ?? '').replace(/\n|\f/g, ' ')
}

function getFrenchGenus(
  genera: Array<{ genus: string; language: { name: string } }>
) {
  return genera.find(g => g.language.name === 'fr')?.genus ?? ''
}

function flattenEvolution(chain: EvolutionChainLink): Array<{
  name: string
  id: number
  level: number | null
}> {
  const result: Array<{ name: string; id: number; level: number | null }> = []
  function walk(link: EvolutionChainLink) {
    const urlParts = link.species.url.split('/')
    const id = parseInt(urlParts[urlParts.length - 2])
    const level = link.evolution_details[0]?.min_level ?? null
    result.push({ name: link.species.name, id, level })
    for (const next of link.evolves_to) walk(next)
  }
  walk(chain)
  return result
}

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: pokemon, isLoading: loadingPokemon, isError } = usePokemon(id!)
  const { data: species } = usePokemonSpecies(id!)
  const { data: evoData } = useEvolutionChain(species?.evolution_chain?.url)

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-6xl mb-4">😢</p>
          <p className="text-xl font-bold mb-2">Pokémon introuvable</p>
          <Link to="/" className="text-blue-400 hover:underline">← Retour au Pokédex</Link>
        </div>
      </div>
    )
  }

  if (loadingPokemon || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal'
  const { bg } = getTypeColor(primaryType)
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.other.home.front_default ??
    pokemon.sprites.front_default

  const frenchName = species ? getFrenchName(species) : pokemon.name.replace(/-/g, ' ')
  const flavorText = species ? getFrenchFlavorText(species.flavor_text_entries) : ''
  const genus = species ? getFrenchGenus(species.genera) : ''
  const defendingTypes = pokemon.types.map(t => t.type.name)

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null

  const evoChain = evoData ? flattenEvolution(evoData.chain) : []

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${bg}55 0%, ${bg}22 50%, transparent 80%)`,
          borderBottom: `1px solid ${bg}33`,
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: bg }}
        />

        <div className="max-w-5xl mx-auto px-4 pt-4 pb-0">
          {/* Back nav */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Pokédex
            </Link>
            <div className="flex items-center gap-2">
              {prevId && (
                <Link
                  to={`/pokemon/${prevId}`}
                  className="text-xs text-white/50 hover:text-white transition px-2 py-1 bg-white/5 rounded-lg"
                >
                  ← #{String(prevId).padStart(4, '0')}
                </Link>
              )}
              {nextId && (
                <Link
                  to={`/pokemon/${nextId}`}
                  className="text-xs text-white/50 hover:text-white transition px-2 py-1 bg-white/5 rounded-lg"
                >
                  #{String(nextId).padStart(4, '0')} →
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Artwork */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="shrink-0"
            >
              {artwork ? (
                <img
                  src={artwork}
                  alt={frenchName}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-6xl">?</span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="pb-6 text-center sm:text-left"
            >
              <p className="text-sm font-bold text-white/40 mb-1">{padId(pokemon.id)}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white capitalize mb-1">
                {frenchName}
              </h1>
              {genus && <p className="text-sm text-white/50 mb-3 italic">{genus}</p>}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {pokemon.types.map(t => (
                  <TypeBadge key={t.type.name} type={t.type.name} size="lg" />
                ))}
              </div>
              {flavorText && (
                <p className="mt-3 text-sm text-white/60 max-w-md leading-relaxed">
                  {flavorText}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            {/* Physical info */}
            <Section title="Informations">
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Taille" value={cmToM(pokemon.height)} />
                <InfoCard label="Poids" value={kgToKg(pokemon.weight)} />
                <InfoCard
                  label="Capacités"
                  value={pokemon.abilities
                    .filter(a => !a.is_hidden)
                    .map(a => capitalize(a.ability.name.replace(/-/g, ' ')))
                    .join(', ')}
                />
                <InfoCard
                  label="Talent caché"
                  value={
                    pokemon.abilities.find(a => a.is_hidden)
                      ? capitalize(
                          pokemon.abilities.find(a => a.is_hidden)!.ability.name.replace(/-/g, ' ')
                        )
                      : '—'
                  }
                />
              </div>
            </Section>

            {/* Stats */}
            <Section title="Statistiques">
              <div className="space-y-3">
                {pokemon.stats.map(s => (
                  <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} color={bg} />
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-xs text-gray-400 text-right shrink-0">Total</span>
                    <span className="text-sm font-bold text-white">
                      {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Type effectiveness */}
            <Section title="Efficacité des types">
              <TypeEffectiveness types={defendingTypes} />
            </Section>

            {/* Evolution chain */}
            {evoChain.length > 1 && (
              <Section title="Chaîne d'évolution">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {evoChain.map((evo, i) => (
                    <div key={evo.id} className="flex items-center gap-2">
                      {i > 0 && (
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {evo.level && (
                            <span className="text-[10px] text-gray-500">Niv.{evo.level}</span>
                          )}
                        </div>
                      )}
                      <Link to={`/pokemon/${evo.id}`}>
                        <div
                          className={`flex flex-col items-center p-2 rounded-xl transition hover:bg-white/10 ${
                            evo.id === pokemon.id ? 'ring-2 ring-white/30 bg-white/5' : ''
                          }`}
                        >
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                            alt={evo.name}
                            className="w-14 h-14 object-contain"
                            loading="lazy"
                          />
                          <span className="text-[10px] text-gray-400 capitalize mt-1">
                            {evo.name.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h2>
      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
        {children}
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white capitalize">{value}</p>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
