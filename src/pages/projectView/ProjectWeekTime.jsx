import { formatTime } from '../../utils/formatTime'

// time tracked on this project since Monday; click opens the log of where it comes from
export default function ProjectWeekTime({ minutes, open, onToggle }) {
   return (
      <button type='button' onClick={onToggle}
         className='shrink-0 font-retro text-lg px-2 rounded-sm bg-accent-soft text-text-primary select-none cursor-pointer hover:bg-accent-muted/40'
         title={open ? 'Hide the log' : 'Tracked on this project this week (Mon–Sun) — click for the log'}>
         {formatTime(minutes)} <span className='text-text-muted'>this week {open ? '▴' : '▾'}</span>
      </button>
   )
}
