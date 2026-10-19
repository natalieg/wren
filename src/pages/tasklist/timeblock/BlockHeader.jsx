import useProjectsContext from '../../../hooks/useProjectsContext'
import { formatTime, secondsToMinutes, formatTimeWithSeconds } from '../../../utils/formatTime'
import BlockBar from './BlockBar'
import { blockLane } from './blockLayout'

const stateStyles = {
   buffer: 'bg-success-light text-success',
   full: 'bg-gold/25 text-text-primary',
   over: 'bg-accent-soft text-accent-primary',
}

function stateLabel({ state, diffMinutes }) {
   if (state === 'over') return `+${formatTime(diffMinutes)} over plan`
   if (state === 'full') return 'plan fits'
   return `${formatTime(-diffMinutes)} buffer`
}

const iconBtn = 'w-7 h-7 rounded-full text-text-muted hover:text-text-primary hover:bg-surface/70 cursor-pointer'

// nodeRef is what dnd-kit measures, handleProps only go on the grip so the buttons stay clickable
export default function BlockHeader({ block, stats, nodeRef, handleProps, open, onToggleOpen, generalOpen, onToggleGeneral, onFinish, onDelete }) {
   const { projects } = useProjectsContext()
   const name = projects.find(p => p.id === block.project)?.name ?? block.label
   const trackedMinutes = secondsToMinutes(stats.trackedSeconds)
   const overDuration = trackedMinutes > stats.durationMinutes

   return (
      <div ref={nodeRef} className={`${blockLane} select-none`}>
         <div className='bg-accent-soft/60 rounded-md px-2 py-2 flex flex-col gap-1.5 min-w-0'>
            <div className='flex items-center gap-2'>
               <span {...handleProps}
                  className={`text-text-muted px-1 ${stats.isBusy ? 'opacity-30' : 'cursor-grab'}`}
                  title={stats.isBusy ? 'Running blocks stay on top' : 'Move block'}>⠿</span>
               <button type='button' className={iconBtn} onClick={onToggleOpen} title={open ? 'Collapse' : 'Expand'}>
                  {open ? '▾' : '▸'}
               </button>
               <div className='flex items-baseline gap-2 min-w-0 flex-1'>
                  <b className='font-title tracking-wide truncate'>{name}</b>
                  <span className='text-xs text-text-secondary whitespace-nowrap'>
                     {formatTime(stats.durationMinutes)} {block.project ? 'block' : 'topic block'}
                  </span>
               </div>
               <span className='font-retro text-xl whitespace-nowrap'>
                  {formatTime(trackedMinutes)} <span className='text-text-muted'>/ {formatTime(stats.durationMinutes)}</span>
               </span>
               <button type='button' className={iconBtn} onClick={onFinish} title='Finish block — open tasks stay on the day'>✓</button>
               <button type='button' className={iconBtn} onClick={onDelete} title='Delete block — its tasks stay'>✕</button>
            </div>
            <BlockBar durationMinutes={stats.durationMinutes} plannedMinutes={stats.plannedMinutes} trackedMinutes={trackedMinutes} />
            <div className='flex gap-2 items-center flex-wrap text-xs text-text-secondary'>
               <span className={`px-2 py-0.5 rounded-pill font-semibold ${stateStyles[stats.state]}`}>{stateLabel(stats)}</span>
               <span>
                  planned {formatTime(stats.plannedMinutes)}, tracked {formatTime(trackedMinutes)}
                  {overDuration && ' (no penalty, just so you know)'}
               </span>
               {/* quiet on purpose — general time is the exception, not the main thing */}
               <button type='button' onClick={onToggleGeneral}
                  className={`ml-auto text-[11px] cursor-pointer transition-opacity duration-(--dur-fast)
                  ${generalOpen ? 'opacity-90' : 'opacity-50 hover:opacity-90'}`}
                  title='Time on this block that belongs to no task'>
                  ⫸ general{stats.generalSeconds > 0 && ` ${formatTimeWithSeconds(stats.generalSeconds)}`}
               </button>
            </div>
         </div>
      </div>
   )
}
