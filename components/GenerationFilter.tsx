import { GENERATIONS } from '../utils/generations'

interface GenerationFilterProps {
  selected: number | null
  onChange: (gen: number | null) => void
}

export default function GenerationFilter({ selected, onChange }: GenerationFilterProps) {
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
      {GENERATIONS.map((gen, index) => {
        const isSelected = selected === index
        return (
          <button
            key={index}
            onClick={() => onChange(isSelected ? null : index)}
            title={gen.label}
            className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition"
            style={
              isSelected
                ? {
                    backgroundColor: '#818cf8',
                    color: '#fff',
                    boxShadow: '0 0 12px #818cf888',
                  }
                : {
                    backgroundColor: '#818cf822',
                    color: '#818cf8',
                    border: '1px solid #818cf855',
                  }
            }
          >
            Gen {gen.roman}
          </button>
        )
      })}
    </div>
  )
}
