import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import TypeBadge from './TypeBadge'
import { getTypeColor } from '../utils/typeColors'
import type { Pokemon } from '../types/pokemon'
import frenchNames from '../data/frenchNames.json'

const FR_NAMES = frenchNames as Record<string, string>

interface PokemonCardProps {
  name: string
  url: string
}

async function fetchPokemon(url: string): Promise<Pokemon> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function padId(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

export default function PokemonCard({ name, url }: PokemonCardProps) {
  const { data, isLoading } = useQuery<Pokemon>({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(url),
    staleTime: Infinity,
  })

  if (isLoading || !data) {
    return (
      <div className="rounded-2xl bg-white/5 animate-pulse aspect-[3/4]" />
    )
  }

  const primaryType = data.types[0]?.type.name ?? 'normal'
  const { bg } = getTypeColor(primaryType)
  const artwork =
    data.sprites.other['official-artwork'].front_default ??
    data.sprites.other.home.front_default ??
    data.sprites.front_default

  return (
    <Link to={`/pokemon/${data.id}`}>
      <motion.div
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${bg}33 0%, ${bg}88 100%)`,
          border: `1px solid ${bg}44`,
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${bg} 0%, transparent 60%)`,
          }}
        />

        <div className="relative p-3 pb-4">
          {/* Number */}
          <div className="text-[11px] font-bold text-white/40 mb-1">
            {padId(data.id)}
          </div>

          {/* Artwork */}
          <div className="relative flex justify-center items-center h-28 sm:h-32">
            {artwork ? (
              <img
                src={artwork}
                alt={data.name}
                className="h-full w-full object-contain drop-shadow-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-3xl">?</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mt-2 text-center">
            <h3 className="text-sm font-bold text-white capitalize truncate">
              {FR_NAMES[String(data.id)] ?? data.name.replace(/-/g, ' ')}
            </h3>
          </div>

          {/* Types */}
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {data.types.map(t => (
              <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
