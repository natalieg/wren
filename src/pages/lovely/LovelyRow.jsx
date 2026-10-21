import PlayBtn from '../../components/elements/PlayBtn'
import { DONE } from '../../utils/constants'
import { isLovely } from '../../utils/lovely'
import { formatTime, formatTimeWithSeconds, formatClockTime } from '../../utils/formatTime'

// soft bullets instead of crossing out: • → ✓, and ✿ → ❀ for lovely tasks
function bulletOf(done, lovely) {
   if (lovely) return done ? '❀' : '✿'
   return done ? '✓' : '•'
}

export default function LovelyRow({ task, isRunning, liveSeconds, taskActions }) {
   const { toggleDone, startTracking, stopTracking, setEditingTaskId } = taskActions
   const done = task.list === DONE
   const lovely = isLovely(task)
   const tracked = (task.trackedTime || 0) + liveSeconds
   const bulletColor = done ? 'text-[#5fd2ac]' : lovely ? 'text-[#f7719e]' : 'text-[#a898bb]'

   return (
      <div className={`group grid grid-cols-[2.25rem_minmax(0,1fr)_auto_3.5rem] items-center gap-2 rounded-md pr-2 min-h-11
         transition-colors duration-(--dur-fast) hover:bg-[#f6ecff]/70 ${isRunning ? 'bg-[#fff0f6]' : ''}`}>
         <button type='button' onClick={() => toggleDone(task.id)}
            title={done ? 'not done yet' : 'done'}
            className={`font-hand text-3xl font-bold leading-none cursor-pointer softTransition hover:scale-125 ${bulletColor}`}>
            {bulletOf(done, lovely)}
         </button>
         <button type='button' onClick={() => setEditingTaskId(task.id)}
            className={`text-left font-hand text-2xl leading-tight cursor-pointer truncate ${done ? 'text-[#a898bb]' : 'text-text-secondary'}`}>
            <span className={lovely && !done ? 'marker-pink' : ''}>{task.label}</span>
         </button>
         <div className='flex items-center gap-1'>
            {!done &&
               <PlayBtn id={'lovelyTracking_' + task.id} active={isRunning} showAlways={isRunning}
                  onClick={() => isRunning ? stopTracking() : startTracking(task.id)} />}
            <span className={`font-hand text-xl ${isRunning ? 'tnum text-base text-[#7a52b3]' : 'text-text-muted'}`}>
               {isRunning ? formatTimeWithSeconds(tracked) : formatTime(parseInt(task.time) || 0)}
            </span>
         </div>
         <span className='tnum text-sm text-text-muted text-right'>
            {task.estimate && !done ? formatClockTime(task.estimate) : ''}
         </span>
      </div>
   )
}
