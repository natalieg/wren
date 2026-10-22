import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import TasksContext from '../../context/TasksContext'
import useSettingsContext from '../../hooks/useSettingsContext'
import LovelyRow from './LovelyRow'
import LovelyBlock from './LovelyBlock'
import Vase from './Vase'
import Washi from './Washi'
import Shortlist from './Shortlist'
import AddToToday from './AddToToday'
import useShortlist from '../../hooks/useShortlist'
import birdSticker from '../../assets/img/lovely/sticker-bird.webp'
import heartSticker from '../../assets/img/lovely/sticker-heart.webp'
import mothKey from '../../assets/img/lovely/moth-pink.webp'
import { isBlock, activeBlockIds, blockIdOf } from '../../utils/blocks'
import { isLovely, finishedToday, otherSecondsToday, sprinkleCount, canWeave, dayEndOf, splitAtDayEnd, doneInPlace, MAX_FLOWERS, DAY_END_HOUR } from '../../utils/lovely'
import { formatClockTime } from '../../utils/formatTime'

const BLOCK_TAPES = ['moths', 'gold', 'blue']
// a little thing pulled from the shortlist lands on the day with this estimate
const SHORTLIST_MINUTES = 10

// the day list as a bullet journal: same tasks, same tracking, kinder voice
export default function LovelyList() {
   const { taskList, openTasks, finishedTasks, taskActions, runningTaskId, trackedSeconds } = useContext(TasksContext)
   const { settings, updateSetting } = useSettingsContext()
   const { rolloverHour } = settings
   const inPlace = !!settings.lovelyDoneInPlace
   const { shortlist, addToShortlist, removeFromShortlist } = useShortlist()
   const [showLater, setShowLater] = useState(false)
   const now = Date.now()

   const blockIds = activeBlockIds(openTasks)
   const topLevel = openTasks.filter(t => !blockIdOf(t, blockIds))
   const running = openTasks.find(t => t.id === runningTaskId)
   const runningTopId = (running && blockIdOf(running, blockIds)) || runningTaskId
   const dayEnd = dayEndOf(now, rolloverHour)
   const { visible, later } = splitAtDayEnd(topLevel, dayEnd, { now, runningTopId })
   const dayIsOver = now >= dayEnd

   const doneToday = finishedToday(finishedTasks, { now, rolloverHour })
   const looseDone = doneToday.filter(t => !isBlock(t) && !blockIdOf(t, blockIds))
   const flowers = doneToday.filter(isLovely).slice(0, MAX_FLOWERS)
   const sprinkles = sprinkleCount(otherSecondsToday(taskList, { runningTaskId, trackedSeconds, now, rolloverHour }))
   const weavable = canWeave(taskList, { runningTaskId, now, rolloverHour })
   const hasLovely = taskList.some(isLovely)
   const dayEnds = visible.at(-1)?.estimate
   const dayItems = inPlace ? doneInPlace(doneToday, visible, blockIds) : visible

   const pickFromShortlist = (item) => {
      taskActions.handleAddTask(item.label, SHORTLIST_MINUTES)
      removeFromShortlist(item.id)
   }

   const rowProps = (t) => ({
      isRunning: t.id === runningTaskId,
      liveSeconds: t.id === runningTaskId ? trackedSeconds : 0,
      taskActions,
      struck: inPlace,
   })
   let blockCount = 0
   const renderItem = (t) => isBlock(t)
      ? <LovelyBlock key={t.id} block={t} rowProps={rowProps} tape={BLOCK_TAPES[blockCount++ % BLOCK_TAPES.length]}
         openMembers={openTasks.filter(m => blockIdOf(m, blockIds) === t.id)}
         doneMembers={finishedTasks.filter(m => !isBlock(m) && m.blockId === t.id)} />
      : <LovelyRow key={t.id} task={t} {...rowProps(t)} />

   return (
      <div className='w-full max-w-6xl mx-auto py-8 flex flex-wrap gap-1.5 items-stretch drop-shadow-[0_12px_28px_rgba(43,26,61,0.12)]'>
         <main className='paper-dots relative flex-[999_1_560px] min-w-0 rounded-l-2xl rounded-r-sm px-9 pt-12 pb-10 flex flex-col gap-3'>
            <Washi tape='moths' className='-top-3 left-8 h-8 w-56 -rotate-3' />
            <Link to='/' title='back to the task list'
               className='absolute top-5 right-6 font-hand text-xl text-text-muted hover:text-text-secondary'>
               ← task list
            </Link>

            <header className='relative'>
               <p className='font-hand text-2xl text-text-muted -mt-3'>
                  {new Date(now).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
               </p>
               <h1 className='font-hand text-6xl font-bold leading-[0.95] text-[#8a63c9]'>
                  {/* day of the week */}
                  happy {new Date(now).toLocaleDateString('en-GB', { weekday: 'long' })},
                  <img src={heartSticker} alt='' className='inline-block h-10 ml-2 -mt-6 rotate-12' />
               </h1>
               <p className='mt-2 text-sm text-text-secondary/50 font-hand'>
                  {dayIsOver
                     ? <>it&apos;s past {DAY_END_HOUR}:00. rest now, everything else can wait ☾</>
                     : <>nothing to catch up on, small steps still bloom.
                        {dayEnds && <> your day ends around <span className='tnum marker-pink'>{formatClockTime(dayEnds)}</span>.</>}</>}
               </p>
            </header>

            {weavable &&
               <div className='mt-2 hand-box border-2 border-dashed border-[#ffc0d8] bg-[#fff6fa] px-4 py-3 flex flex-wrap items-center gap-3'>
                  <p className='font-hand text-2xl leading-tight text-text-secondary flex-1 min-w-48'>
                     your lovely things are piling up at the end. let them take their place in the day?
                  </p>
                  <button type='button' onClick={taskActions.weaveLovelyTasks}
                     className='rounded-pill bg-[#ffdcea] px-4 py-2 min-h-11 text-sm font-bold text-text-secondary cursor-pointer shadow-[0_3px_0_#ffc0d8] softTransition hover:-translate-y-0.5'>
                     ✿ weave them in
                  </button>
               </div>}
            {!hasLovely &&
               <p className='font-hand text-2xl text-[#8a63c9]'>
                  → mark tasks as ✿ lovely in their edit window, and they&apos;ll bloom here
               </p>}

            <div className='flex flex-wrap items-start justify-between gap-2 mt-1 opacity-50 hover:opacity-80 transition-opacity duration-300'>
               <AddToToday onAddTask={taskActions.handleAddTask} onAddBlock={taskActions.handleAddBlock} />
               <button type='button' onClick={() => updateSetting('lovelyDoneInPlace', !inPlace)}
                  title='where finished tasks go'
                  className='font-hand text-xl text-text-muted cursor-pointer hover:text-text-secondary'>
                  {inPlace ? '✓ done stays in the day' : '✓ done gathers below'}
               </button>
            </div>

            <div className='flex flex-col mt-2'>
               {visible.length === 0 && later.length === 0 && shortlist.length === 0 &&
                  <p className='font-hand text-2xl text-text-muted py-4'>a blank page. nothing planned, nothing owed.</p>}
               {visible.length === 0 && shortlist.length > 0 && !dayIsOver &&
                  <div className='hand-box border-2 border-dashed border-[#d9c9ea] bg-white/60 px-4 py-3 my-2'>
                     <p className='font-hand text-2xl text-text-secondary'>nothing left on today&apos;s page. one little thing?</p>
                     <div className='flex flex-wrap gap-2 mt-2'>
                        {shortlist.slice(0, 3).map(item =>
                           <button key={item.id} type='button' onClick={() => pickFromShortlist(item)}
                              className='rounded-pill bg-[#f3e9ff] px-3 py-1 min-h-10 font-hand text-xl text-[#6b5486] cursor-pointer softTransition hover:-translate-y-0.5'>
                              ◦ {item.label}
                           </button>)}
                     </div>
                  </div>}
               {dayItems.map(renderItem)}
            </div>

            {later.length > 0 &&
               <section className='mt-2'>
                  <button type='button' onClick={() => setShowLater(!showLater)}
                     className='font-hand text-2xl text-text-muted cursor-pointer hover:text-text-secondary'>
                     ☾ {later.length} {later.length === 1 ? 'thing' : 'things'} for after {DAY_END_HOUR}:00, they can wait for tomorrow
                     <span className='text-lg ml-2'>{showLater ? 'hide' : 'peek'}</span>
                  </button>
                  {showLater && <div className='flex flex-col opacity-60'>{later.map(renderItem)}</div>}
               </section>}

            {!inPlace && looseDone.length > 0 &&
               <section className='mt-4'>
                  <h2 className='font-hand text-2xl font-bold text-text-muted'>done today</h2>
                  {looseDone.map(t => <LovelyRow key={t.id} task={t} {...rowProps(t)} />)}
               </section>}
         </main>

         <aside className='paper-dots relative flex-[1_1_320px] min-w-0 rounded-r-2xl rounded-l-sm px-8 pt-12 pb-9 flex flex-col gap-8'>
            <Washi tape='gold' className='-top-3 right-10 h-7 w-36 rotate-4' />
            <Vase flowers={flowers} sprinkles={sprinkles} />
            <Shortlist shortlist={shortlist} onAdd={addToShortlist} onRemove={removeFromShortlist} onPick={pickFromShortlist} />
            {/* <section className='relative mt-auto hand-box border-2 border-dashed border-[#d9c9ea] px-4 py-3 -rotate-1'>
               <img src={birdSticker} alt='' className='absolute -top-14 right-2 h-16 rotate-6' />
               <h2 className='font-hand text-2xl font-bold text-[#6b5486]'>key</h2>
               <div className='font-hand text-xl grid grid-cols-2 gap-x-4 text-text-secondary'>
                  <span><span className='text-[#a898bb]'>•</span> task</span><span><span className='text-[#5fd2ac]'>✓</span> done</span>
                  <span><span className='text-[#f7719e]'>✿</span> lovely</span><span><span className='text-[#5fd2ac]'>❀</span> bloomed</span>
                  <span>✦ block</span>
                  <span className='flex items-center gap-1'><img src={mothKey} alt='' className='h-5 pastel-soft' /> 30 min work</span>
               </div>
            </section> */}
         </aside>
      </div>
   )
}
