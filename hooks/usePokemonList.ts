import { useQuery } from '@tanstack/react-query'
import type { PokemonListItem, PokemonListResponse } from '../types/pokemon'

async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0')
  if (!res.ok) throw new Error('Failed to fetch Pokémon list')
  const data: PokemonListResponse = await res.json()
  return data.results
}

export function usePokemonList() {
  return useQuery<PokemonListItem[]>({
    queryKey: ['pokemon-list'],
    queryFn: fetchAllPokemon,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
