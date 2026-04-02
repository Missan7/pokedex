export interface GenerationRange {
  min: number
  max: number
  label: string
  roman: string
}

export const GENERATIONS: GenerationRange[] = [
  { min: 1,   max: 151,  label: 'Génération I',   roman: 'I'   },
  { min: 152,  max: 251,  label: 'Génération II',  roman: 'II'  },
  { min: 252,  max: 386,  label: 'Génération III', roman: 'III' },
  { min: 387,  max: 493,  label: 'Génération IV',  roman: 'IV'  },
  { min: 494,  max: 649,  label: 'Génération V',   roman: 'V'   },
  { min: 650,  max: 721,  label: 'Génération VI',  roman: 'VI'  },
  { min: 722,  max: 809,  label: 'Génération VII', roman: 'VII' },
  { min: 810,  max: 905,  label: 'Génération VIII',roman: 'VIII'},
  { min: 906,  max: 1025, label: 'Génération IX',  roman: 'IX'  },
]

export function getGenerationIndex(pokemonId: number): number {
  return GENERATIONS.findIndex(g => pokemonId >= g.min && pokemonId <= g.max)
}
