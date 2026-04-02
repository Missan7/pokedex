import { useQuery } from '@tanstack/react-query'
import { useEncounters } from '../hooks/useEncounters'
import { getVersionLabel, getVersionColor, getMethodLabel } from '../utils/gameVersions'
import type { PokemonEncounter } from '../types/pokemon'

interface Props {
  pokemonId: number
}

interface LocationAreaData {
  name: string
  names: Array<{ name: string; language: { name: string } }>
}

function useLocationAreaName(url: string) {
  return useQuery<LocationAreaData>({
    queryKey: ['location-area', url],
    queryFn: async () => {
      const res = await fetch(url)
      return res.json()
    },
    staleTime: Infinity,
  })
}

function LocationName({ url, slug }: { url: string; slug: string }) {
  const { data } = useLocationAreaName(url)
  if (!data) {
    // Formater le slug en attendant
    return <span>{slug.replace(/-area$/, '').replace(/-/g, ' ')}</span>
  }
  const frName = data.names.find(n => n.language.name === 'fr')?.name
  const enName = data.names.find(n => n.language.name === 'en')?.name
  return <span>{frName ?? enName ?? slug.replace(/-area$/, '').replace(/-/g, ' ')}</span>
}

interface VersionGroup {
  version: string
  locations: Array<{
    locationArea: PokemonEncounter['location_area']
    maxChance: number
    methods: string[]
  }>
}

function groupByVersion(encounters: PokemonEncounter[]): VersionGroup[] {
  const map = new Map<string, VersionGroup>()

  for (const encounter of encounters) {
    for (const vd of encounter.version_details) {
      const v = vd.version.name
      if (!map.has(v)) map.set(v, { version: v, locations: [] })
      const methods = vd.encounter_details.map(e => e.method.name)
      map.get(v)!.locations.push({
        locationArea: encounter.location_area,
        maxChance: vd.max_chance,
        methods: [...new Set(methods)],
      })
    }
  }

  return Array.from(map.values())
}

export default function EncounterLocations({ pokemonId }: Props) {
  const { data: encounters, isLoading } = useEncounters(pokemonId)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!encounters || encounters.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Ce Pokémon ne se trouve pas à l'état sauvage dans les jeux principaux.
      </p>
    )
  }

  const groups = groupByVersion(encounters)

  return (
    <div className="space-y-3">
      {groups.map(group => {
        const color = getVersionColor(group.version)
        return (
          <div key={group.version}>
            {/* Badge de version */}
            <div
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ backgroundColor: `${color}33`, color }}
            >
              {getVersionLabel(group.version)}
            </div>
            <div className="space-y-1 pl-1">
              {group.locations.map((loc, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-white/80 capitalize">
                    <LocationName url={loc.locationArea.url} slug={loc.locationArea.name} />
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {loc.methods.map(m => (
                      <span
                        key={m}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400"
                      >
                        {getMethodLabel(m)}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-500">{loc.maxChance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
