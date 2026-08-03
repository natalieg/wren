import DocWrapper from '../components/DocWrapper'
import Header from '../components/elements/Header'
import useHistory from '../hooks/useHistory'
import { formatDate } from '../utils/formatTime'
import { GlyphBorder } from '../components/elements/GlyphBorder'

export default function History() {
    const { history } = useHistory()

    //debug log
    console.log('History:', history)

    // TODO: history should already come back newest-first from useHistory
    // (see the TODOs in useHistory.js) — remove this comment once you've
    // verified that's actually true, don't just trust it blindly

    const allTime = (tasks) => {
        return tasks.reduce((total, task) => total + (parseInt(task.trackedTime / 60) || task.time), 0)
    }

    const taskStyle = 'flex justify-between w-full max-w-[300px] px-4'
    const badgeStyle = 'bg-text-primary/10 text-text-primary px-2 py-1 rounded-full text-sm font-semibold'

    return (
        <DocWrapper header='History'>
            <div className='w-full flex flex-col justify-center items-center gap-4'>
                {history.map(entry => (
                    <GlyphBorder key={entry.date} variant='corners' glyph='⊡'
                        color='color-mix(in srgb, var(--color-text-secondary) 30%, transparent)'
                        className='min-w-[80%] max-w-[90%]'>
                        <div className='flex flex-col items-center p-2'>
                            <Header label={formatDate(entry.date)} fontSize='text-2xl' className='pb-4'
                                glyphs='․⁘' glyphSize='text-md' />
                            <p id={'historyEntrySummary_' + entry.date}
                                className={`${taskStyle} pb-2`}>
                                <span className={badgeStyle}>Tasks: {entry.tasks.length}</span>
                                <span className={badgeStyle}>Time: {allTime(entry.tasks)}</span>
                            </p>
                            {entry.tasks.map(task => (
                                <p key={task.id}
                                    className={taskStyle}>
                                    <span>{task.label} </span>
                                    <span>{parseInt(task.trackedTime / 60) || task.time} </span>
                                </p>
                            ))}
                        </div>
                    </GlyphBorder>
                ))}
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
