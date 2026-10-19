import Bar from './elements/Bar'
import { formatTime, formatClockTime } from '../utils/formatTime'
import { minutesLeft, minutesDone } from '../utils/blocks'

export default function TimeProgress({ openTasks, finishedTasks, startedAt, resetStartedAt }) {
  // blocks count once, not on top of their tasks — see utils/blocks
  const totalTimeLeft = minutesLeft(openTasks, finishedTasks);

  // if tracked < 1min it falls back to the estimate — see effectiveMinutes in utils/formatTime
  // LATER evaluate if user can change this behaviour in settings
  const totalTimeDone = minutesDone(finishedTasks);

  const totalTimePlanned = totalTimeDone + totalTimeLeft;
  const donePercent = totalTimePlanned > 0 ? (totalTimeDone / totalTimePlanned) * 100 : 0;

  return (
    <div className='flex gap-4 items-center justify-center mt-2 mb-4'>
      <div id='timePanel' className='select-none smallPanel self-start'>
        <div className='group text-xs text-text-muted'>Started: {formatClockTime(startedAt)}
          <span className='opacity-0 group-hover:opacity-100 cursor-pointer softTransition'
            onClick={resetStartedAt} title='Reset start time'> ↩ </span>
        </div>
        <Bar percent={donePercent} color='success' />
        <div className='flex items-center justify-between gap-4'>
          <span className='text-xs font-semibold text-success'>
            {formatTime(totalTimeDone)} done
          </span>
          <span className='text-xs font-semibold text-text-muted'>
            {formatTime(totalTimeLeft)} left
          </span>
        </div>
      </div>
    </div>
  )
}
