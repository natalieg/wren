import { useState } from 'react'
import useProjectsContext from '../../../hooks/useProjectsContext'
import Input from '../../../components/elements/Input'
import { parseHours } from '../../../utils/formatTime'

const DEFAULT_HOURS = 2
// a block shorter than half an hour makes no sense
const MIN_HOURS = 0.5
const STEP_HOURS = 0.5

// same shape as TaskInput: a project name binds the block to that project, any other name is a free topic block
export default function BlockInput({ onSubmit }) {
   const { projects } = useProjectsContext()
   const [name, setName] = useState('')
   // raw text, parsed on submit — a number field drops "1." mid-typing and can't take a comma
   const [hours, setHours] = useState(String(DEFAULT_HOURS))
   const [atTop, setAtTop] = useState(false)
   const project = projects.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase())

   const submit = () => {
      const parsed = parseHours(hours)
      if (!name.trim()) return
      const safeHours = isNaN(parsed) ? DEFAULT_HOURS : Math.max(parsed, MIN_HOURS)
      onSubmit(project?.id, project?.name ?? name.trim(), Math.round(safeHours * 60), { atTop })
      setName('')
      setHours(String(DEFAULT_HOURS))
   }

   const handleKeyDown = (e) => e.key === 'Enter' && submit()

   // arrow keys still step in half hours, like the number field did
   const handleHoursKeyDown = (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return handleKeyDown(e)
      e.preventDefault()
      const current = parseHours(hours)
      const base = isNaN(current) ? DEFAULT_HOURS : current
      setHours(String(Math.max(base + (e.key === 'ArrowUp' ? STEP_HOURS : -STEP_HOURS), MIN_HOURS)))
   }

   return (
      <div className='flex gap-2 w-full items-center'>
         <button type='button'
            className='text-text-muted hover:text-text-primary w-6 shrink-0 select-none'
            title={atTop ? 'Adding to top' : 'Adding to bottom'}
            onClick={() => setAtTop(!atTop)}>
            {atTop ? '↑' : '↓'}
         </button>
         <Input placeholder='Project or topic...' list='blockProjects'
            value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} />
         <datalist id='blockProjects'>
            {projects.map(p => <option key={p.id} value={p.name} />)}
         </datalist>
         {/* hours in half steps, the unit sits inside the field so it reads like "2 h" */}
         <div className='relative shrink-0'>
            <Input width='w-20' value={hours} className='pr-6'
               onChange={(e) => setHours(e.target.value)}
               onKeyDown={handleHoursKeyDown} />
            <span className='absolute right-2 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none'>h</span>
         </div>
      </div>
   )
}
