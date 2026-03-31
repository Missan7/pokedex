import { useQuery } from '@tanstack/react-query'
import type { Pokemon, PokemonSpecies, EvolutionChainData } from '../types/pokemon'

async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
  if (!res.ok) throw new Error('Pokémon introuvable')
  return res.json()
}

async function fetchSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idOrName}`)
  if (!res.ok) throw new Error('Espèce introuvable')
  return res.json()
}

async function fetchEvolutionChain(url: string): Promise<EvolutionChainData> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Chaîne d\'évolution introuvable')
  return res.json()
}

export function usePokemon(id: string | number) {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: Infinity,
    enabled: !!id,
  })
}

export function usePokemonSpecies(id: string | number) {
  return useQuery<PokemonSpecies>({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchSpecies(id),
    staleTime: Infinity,
    enabled: !!id,
  })
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery<EvolutionChainData>({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchEvolutionChain(url!),
    staleTime: Infinity,
    enabled: !!url,
  })
}
