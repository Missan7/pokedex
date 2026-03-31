export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  results: PokemonListItem[]
}

export interface PokemonType {
  slot: number
  type: { name: string; url: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string }
}

export interface PokemonAbility {
  ability: { name: string }
  is_hidden: boolean
}

export interface PokemonSprites {
  other: {
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
    home: {
      front_default: string | null
    }
  }
  front_default: string | null
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  sprites: PokemonSprites
}

export interface EvolutionSpecies {
  name: string
  url: string
}

export interface EvolutionChainLink {
  species: EvolutionSpecies
  evolves_to: EvolutionChainLink[]
  evolution_details: Array<{
    min_level: number | null
    item: { name: string } | null
    trigger: { name: string }
  }>
}

export interface EvolutionChainData {
  chain: EvolutionChainLink
}

export interface PokemonSpecies {
  id: number
  names: Array<{ name: string; language: { name: string } }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string }
    version: { name: string }
  }>
  evolution_chain: { url: string }
  genera: Array<{ genus: string; language: { name: string } }>
  color: { name: string }
}

export type TypeName =
  | 'normal' | 'feu' | 'eau' | 'plante' | 'électrik' | 'glace'
  | 'combat' | 'poison' | 'sol' | 'vol' | 'psy' | 'insecte'
  | 'roche' | 'spectre' | 'dragon' | 'ténèbres' | 'acier' | 'fée'

export type ApiTypeName =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export interface TypeEffectivenessMap {
  '4x': string[]
  '2x': string[]
  '0.5x': string[]
  '0.25x': string[]
  '0x': string[]
}
