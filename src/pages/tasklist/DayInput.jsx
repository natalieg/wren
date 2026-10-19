import { useState } from 'react'
import MultiSwitchFlag from '../../components/elements/MultiSwitchFlag'
import TaskInput from '../../components/tasks/TaskInput'
import BlockInput from './timeblock/BlockInput'

const modes = [
   { value: 'task', label: '', emoji: '☰', title: 'Adding a task — click for block' },
   { value: 'block', label: '', emoji: '▦', title: 'Adding a time block — click for task' },
]

// the day list's add row: a task as before, or a time block — both one row high, so switching doesn't jump
export default function DayInput({ onAddTask, onAddBlock }) {
   const [mode, setMode] = useState('task')
   return (
      <div className='flex gap-2 items-center w-full'>
         <MultiSwitchFlag options={modes} value={mode} onChange={setMode} rounded='rounded-md' width='w-9 shrink-0' />
         {mode === 'task'
            ? <TaskInput id='main' showPlacement onSubmit={onAddTask} />
            : <BlockInput onSubmit={onAddBlock} />}
      </div>
   )
}
