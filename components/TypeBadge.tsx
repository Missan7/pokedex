import { getTypeColor, getTypeLabel } from '../utils/typeColors'

interface TypeBadgeProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const { bg, text } = getTypeColor(type)
  const label = getTypeLabel(type)

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-3 py-1 font-semibold',
    lg: 'text-sm px-4 py-1.5 font-bold',
  }

  return (
    <span
      className={`inline-block rounded-full uppercase tracking-wider ${sizeClasses[size]}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}
