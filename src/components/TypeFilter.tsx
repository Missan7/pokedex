import { getTypeColor, getTypeLabel } from '../utils/typeColors'
import type { ApiTypeName } from '../types/pokemon'

const ALL_TYPES: ApiTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

interface TypeFilterProps {
  selected: string | null
  onChange: (type: string | null) => void
}

export default function TypeFilter({ selected, onChange }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
          selected === null
            ? 'bg-white text-gray-900'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        Tous
      </button>
      {ALL_TYPES.map(type => {
        const { bg, text } = getTypeColor(type)
        const isSelected = selected === type
        return (
          <button
            key={type}
            onClick={() => onChange(isSelected ? null : type)}
            className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition"
            style={
              isSelected
                ? { backgroundColor: bg, color: text, boxShadow: `0 0 12px ${bg}88` }
                : { backgroundColor: `${bg}33`, color: bg, border: `1px solid ${bg}55` }
            }
          >
            {getTypeLabel(type)}
          </button>
        )
      })}
    </div>
  )
}
