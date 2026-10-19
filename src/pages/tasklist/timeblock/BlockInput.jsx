import { useState } from 'react'
import useProjectsContext from '../../../hooks/useProjectsContext'
import Input from '../../../components/elements/Input'

const DEFAULT_HOURS = 2
// a block shorter than half an hour makes no sense
const MIN_HOURS = 0.5

// same shape as TaskInput: a project name binds the block to that project, any other name is a free topic block
export default function BlockInput({ onSubmit }) {
   const { projects } = useProjectsContext()
   const [name, setName] = useState('')
   const [hours, setHours] = useState(DEFAULT_HOURS)
   const [atTop, setAtTop] = useState(false)
   const project = projects.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase())

   const submit = () => {
      if (!name.trim()) return
      onSubmit(project?.id, project?.name ?? name.trim(), Math.round(Math.max(hours, MIN_HOURS) * 60), { atTop })
      setName('')
      setHours(DEFAULT_HOURS)
   }

   const handleKeyDown = (e) => e.key === 'Enter' && submit()

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
            <Input type='number' width='w-20' step={0.5} minValue={MIN_HOURS} value={hours} className='pr-6'
               onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setHours(v) }}
               onKeyDown={handleKeyDown} />
            <span className='absolute right-2 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none'>h</span>
         </div>
      </div>
   )
}
