import DocWrapper from '../components/DocWrapper'
import Header from '../components/elements/Header'
import useHistory from '../hooks/useHistory'
import { formatDate, formatTime } from '../utils/formatTime'

import { GlyphBorder } from '../components/elements/GlyphBorder'


export default function History() {
  const { history } = useHistory()

  const allTime = (tasks) => {
    const acc = tasks.reduce((total, task) => total + (parseInt(task.trackedTime / 60) || task.time), 0)
    return formatTime(acc)
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
                  <span>{formatTime(parseInt(task.trackedTime / 60) || task.time)} </span>
                </p>
              ))}
            </div>
          </GlyphBorder>
        ))}
      </div>
    </DocWrapper>
  )
}
