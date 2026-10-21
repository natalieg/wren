import { useState } from 'react'
import LovelyRow from './LovelyRow'
import Washi from './Washi'
import { formatTime, formatClockTime } from '../../utils/formatTime'

// a block as a hand-drawn box with tape on it; once all its tasks are done it folds away to give the day room
export default function LovelyBlock({ block, openMembers, doneMembers, rowProps, tape = 'moths' }) {
   const [peek, setPeek] = useState(false)
   const allDone = doneMembers.length > 0 && openMembers.length === 0
   const showRows = !allDone || peek

   return (
      <section className='relative mt-6 mb-2 hand-box border-2 border-[#d9c9ea] bg-white/60 px-4 pt-4 pb-2 rotate-[-0.4deg]'>
         <Washi tape={tape} className='-top-3 left-6 h-6 w-28 -rotate-6' />
         <div className='flex items-baseline gap-3 border-b-2 border-dashed border-[#e3d5f0] pb-1'>
            <span className='font-hand text-3xl font-bold text-[#6b5486] marker-gold'>✦ {block.label}</span>
            <span className='font-hand text-xl text-text-muted'>{formatTime(parseInt(block.time) || 0)} block</span>
            {allDone
               ? <button type='button' onClick={() => setPeek(!peek)}
                  className='ml-auto font-hand text-xl text-success cursor-pointer hover:underline'>
                  all done ✓ {peek ? 'fold' : 'peek'}
               </button>
               : block.estimate &&
               <span className='ml-auto tnum text-sm text-text-muted'>until {formatClockTime(block.estimate)}</span>}
         </div>
         {showRows &&
            <div className='flex flex-col pt-1'>
               {openMembers.length === 0 && doneMembers.length === 0 &&
                  <p className='font-hand text-xl text-text-muted py-1'>an empty block, fill it on the task list</p>}
               {[...openMembers, ...doneMembers].map(t => <LovelyRow key={t.id} task={t} {...rowProps(t)} />)}
            </div>}
      </section>
   )
}
