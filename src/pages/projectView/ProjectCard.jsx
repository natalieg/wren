import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/elements/Input'
import Textarea from '../../components/elements/Textarea'
import CheckboxWithLabel from '../../components/elements/CheckboxWithLabel'
import ProjectTasks from './ProjectTasks'
import ProjectWeekTime from './ProjectWeekTime'
import ProjectWeekLog from './ProjectWeekLog'
import useProjectWeekLog from '../../hooks/useProjectWeekLog'

export default function ProjectCard({ project, onNameChange, onNotesChange, onBlocksOnlyChange }) {
   const { log, minutes } = useProjectWeekLog(project.id)
   const [logOpen, setLogOpen] = useState(false)

   return (
      <div className='flex flex-col gap-3 p-4 rounded-sm border-(length:--border-w-thick) border-text-primary bg-surface'>
         <div className='flex items-center gap-2'>
            <Input value={project.name} onChange={(e) => onNameChange(e.target.value)} className='font-bold' />
            <ProjectWeekTime minutes={minutes} open={logOpen} onToggle={() => setLogOpen(!logOpen)} />
            <Link to={`/project/${project.id}`} title='Focus on this project'
               className='shrink-0 text-lg text-text-muted hover:text-text-primary'>⤢</Link>
         </div>
         {logOpen && <ProjectWeekLog log={log} minutes={minutes} />}
         <ProjectTasks project={project} />
         <div className='mt-auto'>
            <Textarea placeholder='Brain dump...' value={project.notes} onChange={(e) => onNotesChange(e.target.value)} rows={4} />
            <CheckboxWithLabel checked={!!project.blocksOnly}
               label='⌛ Time Block Only'
               onChange={(e) => onBlocksOnlyChange(e.target.checked)} />
         </div>
      </div>
   )
}
