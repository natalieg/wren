import { getExpForNextLevel } from '../../utils/character'
import Bar from './Bar'


export default function StatRow({ label, stat, bonus }) {
  const expNeeded = getExpForNextLevel(stat.level)
  const percentage = Math.min((stat.exp / expNeeded) * 100, 100)

  return (
     <div className="relative group">
            <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="tnum text-text-primary font-medium">{stat.level}{bonus ? ` (+${bonus})` : ''}</span>
      </div>


      <div className="mt-1">
        <Bar percent={percentage} color="accent" height="h-1.5" />
      </div>


      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                       hidden group-hover:block
                       bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {stat.exp} / {expNeeded}
      </div>
    </div>
  )
}
