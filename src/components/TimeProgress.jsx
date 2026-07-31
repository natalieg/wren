import Bar from './elements/Bar'
import { formatTime } from '../utils/formatTime'

export default function TimeProgress({ openTasks, finishedTasks }) {
    const totalTimeLeft = openTasks.reduce((sum, task) => {
        return sum + (parseInt(task.time) || 0);
    }, 0);

    const totalTimeDone = finishedTasks.reduce((sum, task) => {
        return sum + (parseInt(task.time) || 0);
    }, 0);

    const totalTimePlanned = totalTimeDone + totalTimeLeft;
    const donePercent = totalTimePlanned > 0 ? (totalTimeDone / totalTimePlanned) * 100 : 0;

    return (
        <div className='flex gap-4 items-center justify-center mt-2 mb-4'>
            <div id='timePanel' className='select-none smallPanel self-start'>
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
