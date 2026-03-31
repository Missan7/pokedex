import { useEffect, useRef, useState } from 'react'
import { STAT_LABELS_FR } from '../utils/typeColors'

interface StatBarProps {
  name: string
  value: number
  color: string
}

const MAX_STAT = 255

export default function StatBar({ name, value, color }: StatBarProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth((value / MAX_STAT) * 100)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  const label = STAT_LABELS_FR[name] ?? name
  const pct = Math.round((value / MAX_STAT) * 100)

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="w-20 text-xs text-gray-400 text-right shrink-0">{label}</span>
      <span className="w-8 text-xs font-bold text-white text-right shrink-0">{value}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
          aria-label={`${label}: ${value} / ${MAX_STAT} (${pct}%)`}
        />
      </div>
    </div>
  )
}
