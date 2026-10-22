import { useState } from 'react'
import DayInput from '../tasklist/DayInput'

// the day list's add row, folded away until needed
export default function AddToToday({ onAddTask, onAddBlock }) {
   const [open, setOpen] = useState(false)

   return (
      <div className='flex flex-col gap-2'>
         <button type='button' onClick={() => setOpen(!open)} aria-expanded={open}
            className='self-start font-hand text-xl text-text-muted cursor-pointer hover:text-text-secondary'>
            {open ? '− fold' : '+ add a task or block'}
         </button>
         {open && <DayInput onAddTask={onAddTask} onAddBlock={onAddBlock} />}
      </div>
   )
}
