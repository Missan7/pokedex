import type { ApiTypeName, TypeEffectivenessMap } from '../types/pokemon'

// Full 18×18 type chart (attacking type → defending type → multiplier)
// 0 = immune, 0.5 = not very effective, 2 = super effective
const TYPE_CHART: Record<ApiTypeName, Partial<Record<ApiTypeName, number>>> = {
  normal:   { rock: 0.5, steel: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

const ALL_TYPES: ApiTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

/**
 * Computes the effective multiplier for each attacking type
 * against a Pokémon with the given defending types.
 */
export function getTypeEffectiveness(defendingTypes: string[]): TypeEffectivenessMap {
  const multipliers: Record<string, number> = {}

  for (const attackType of ALL_TYPES) {
    let multiplier = 1
    for (const defendType of defendingTypes) {
      const row = TYPE_CHART[attackType as ApiTypeName]
      const val = row?.[defendType as ApiTypeName]
      if (val !== undefined) multiplier *= val
    }
    multipliers[attackType] = multiplier
  }

  const result: TypeEffectivenessMap = {
    '4x':    [],
    '2x':    [],
    '0.5x':  [],
    '0.25x': [],
    '0x':    [],
  }

  for (const [type, mult] of Object.entries(multipliers)) {
    if (mult === 4)    result['4x'].push(type)
    else if (mult === 2)    result['2x'].push(type)
    else if (mult === 0.5)  result['0.5x'].push(type)
    else if (mult === 0.25) result['0.25x'].push(type)
    else if (mult === 0)    result['0x'].push(type)
  }

  return result
}
