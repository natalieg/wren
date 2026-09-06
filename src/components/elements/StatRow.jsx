import { getExpForNextLevel } from '../../utils/character'

export default function StatRow({ label, stat }) {
  const expNeeded = getExpForNextLevel(stat.level)
  const percentage = Math.min((stat.exp / expNeeded) * 100, 100)

  return (
     <div className="relative group">
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{stat.level}</span>
      </div>

      <div className="h-1.5 rounded-full bg-border-soft overflow-hidden mt-1">
        <div className="h-full bg-accent-primary" style={{ width: `${percentage}%` }} />
      </div>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                       hidden group-hover:block
                       bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {stat.exp} / {expNeeded}
      </div>
    </div>
  )
}
