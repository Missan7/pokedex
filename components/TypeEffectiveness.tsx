import { getTypeEffectiveness } from '../utils/typeEffectiveness'
import TypeBadge from './TypeBadge'

interface TypeEffectivenessProps {
  types: string[]
}

interface Section {
  key: '4x' | '2x' | '0.5x' | '0.25x' | '0x'
  label: string
  multiplierLabel: string
  colorClass: string
}

const SECTIONS: Section[] = [
  { key: '4x',    label: 'Faiblesse ×4',     multiplierLabel: '×4',   colorClass: 'text-red-400' },
  { key: '2x',    label: 'Faiblesse ×2',     multiplierLabel: '×2',   colorClass: 'text-orange-400' },
  { key: '0.5x',  label: 'Résistance ×½',    multiplierLabel: '×½',   colorClass: 'text-green-400' },
  { key: '0.25x', label: 'Résistance ×¼',    multiplierLabel: '×¼',   colorClass: 'text-emerald-400' },
  { key: '0x',    label: 'Immunité',          multiplierLabel: '×0',   colorClass: 'text-gray-400' },
]

export default function TypeEffectiveness({ types }: TypeEffectivenessProps) {
  const effectiveness = getTypeEffectiveness(types)

  const hasData = SECTIONS.some(s => effectiveness[s.key].length > 0)
  if (!hasData) return null

  return (
    <div className="space-y-4">
      {SECTIONS.map(({ key, label, multiplierLabel, colorClass }) => {
        const typeList = effectiveness[key]
        if (typeList.length === 0) return null
        return (
          <div key={key}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold ${colorClass}`}>{multiplierLabel}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {typeList.map(type => (
                <TypeBadge key={type} type={type} size="sm" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
