import { useQuery } from '@tanstack/react-query'
import type { PokemonEncounter } from '../types/pokemon'

export function useEncounters(id: number | string) {
  return useQuery<PokemonEncounter[]>({
    queryKey: ['encounters', id],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
      if (!res.ok) throw new Error('Failed to fetch encounters')
      return res.json()
    },
    staleTime: Infinity,
    enabled: !!id,
  })
}
