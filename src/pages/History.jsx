import DocWrapper from '../components/DocWrapper'
// import useHistory from '../hooks/useHistory'
import { formatDate, formatTime, formatClockTime } from '../utils/formatTime'

export default function History() {
    // const { history } = useHistory()

    // TODO: history should already come back newest-first from useHistory
    // (see the TODOs in useHistory.js) — remove this comment once you've
    // verified that's actually true, don't just trust it blindly

    return (
        <DocWrapper header='History'>
            <div className='w-full flex flex-col gap-4'>
                {/*{history.map(entry => {
                    // TODO 1: total time for the day — sum entry.tasks[].trackedTime.
                    // WATCH OUT: trackedTime is stored in SECONDS (see flushTrackedTime
                    // in useTasks.js), but formatTime() expects MINUTES — convert
                    // before formatting or the numbers will be 60x too big.

                    // TODO 2: start/end of day — see the OPEN QUESTION comment at the
                    // top of useHistory.js, you still need to decide how this is
                    // derived before you can render it here.

                    return (
                        <div key={entry.date}>
                            {/* TODO 3: entry header row — [date] [total time] [start–end]
                                e.g. formatDate(entry.date) / formatTime(totalMinutes) /
                                formatClockTime(start) + ' - ' + formatClockTime(end) */}

                            {/* TODO 4: one row per task — [label] [trackedTime], same
                                seconds->minutes conversion as TODO 1 applies here too */}
                            {/* {entry.tasks.map(task => (
                                <div key={task.id}>{task.label}</div>
                            ))} */}

            </div>
        </DocWrapper>
    )
}
