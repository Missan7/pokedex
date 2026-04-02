import type { ApiTypeName } from '../types/pokemon'

export const TYPE_COLORS: Record<ApiTypeName, { bg: string; text: string; gradient: string }> = {
  normal:   { bg: '#A8A878', text: '#fff', gradient: 'from-[#A8A878] to-[#8a8a5a]' },
  fire:     { bg: '#F08030', text: '#fff', gradient: 'from-[#F08030] to-[#c85c10]' },
  water:    { bg: '#6890F0', text: '#fff', gradient: 'from-[#6890F0] to-[#3a62c8]' },
  electric: { bg: '#F8D030', text: '#333', gradient: 'from-[#F8D030] to-[#d0a800]' },
  grass:    { bg: '#78C850', text: '#fff', gradient: 'from-[#78C850] to-[#4a9a28]' },
  ice:      { bg: '#98D8D8', text: '#333', gradient: 'from-[#98D8D8] to-[#60b0b0]' },
  fighting: { bg: '#C03028', text: '#fff', gradient: 'from-[#C03028] to-[#901808]' },
  poison:   { bg: '#A040A0', text: '#fff', gradient: 'from-[#A040A0] to-[#702070]' },
  ground:   { bg: '#E0C068', text: '#333', gradient: 'from-[#E0C068] to-[#b89040]' },
  flying:   { bg: '#A890F0', text: '#fff', gradient: 'from-[#A890F0] to-[#7860c8]' },
  psychic:  { bg: '#F85888', text: '#fff', gradient: 'from-[#F85888] to-[#c82858]' },
  bug:      { bg: '#A8B820', text: '#fff', gradient: 'from-[#A8B820] to-[#788800]' },
  rock:     { bg: '#B8A038', text: '#fff', gradient: 'from-[#B8A038] to-[#887818]' },
  ghost:    { bg: '#705898', text: '#fff', gradient: 'from-[#705898] to-[#483070]' },
  dragon:   { bg: '#7038F8', text: '#fff', gradient: 'from-[#7038F8] to-[#4808c8]' },
  dark:     { bg: '#705848', text: '#fff', gradient: 'from-[#705848] to-[#483020]' },
  steel:    { bg: '#B8B8D0', text: '#333', gradient: 'from-[#B8B8D0] to-[#8888a8]' },
  fairy:    { bg: '#EE99AC', text: '#333', gradient: 'from-[#EE99AC] to-[#c66980]' },
}

export const TYPE_LABELS_FR: Record<ApiTypeName, string> = {
  normal:   'Normal',
  fire:     'Feu',
  water:    'Eau',
  electric: 'Électrik',
  grass:    'Plante',
  ice:      'Glace',
  fighting: 'Combat',
  poison:   'Poison',
  ground:   'Sol',
  flying:   'Vol',
  psychic:  'Psy',
  bug:      'Insecte',
  rock:     'Roche',
  ghost:    'Spectre',
  dragon:   'Dragon',
  dark:     'Ténèbres',
  steel:    'Acier',
  fairy:    'Fée',
}

export const STAT_LABELS_FR: Record<string, string> = {
  hp:                  'PV',
  attack:              'Attaque',
  defense:             'Défense',
  'special-attack':    'Att. Spé.',
  'special-defense':   'Déf. Spé.',
  speed:               'Vitesse',
}

export function getTypeColor(type: string): { bg: string; text: string; gradient: string } {
  return TYPE_COLORS[type as ApiTypeName] ?? { bg: '#888', text: '#fff', gradient: 'from-gray-500 to-gray-700' }
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS_FR[type as ApiTypeName] ?? type
}
