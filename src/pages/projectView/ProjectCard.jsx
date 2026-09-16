import { Link } from 'react-router-dom'
import Input from '../../components/elements/Input'
import Textarea from '../../components/elements/Textarea'
import ProjectTasks from './ProjectTasks'

export default function ProjectCard({ project, onNameChange, onNotesChange }) {
   return (
      <div className='flex flex-col gap-3 p-4 rounded-sm border-(length:--border-w-thick) border-text-primary bg-surface'>
         <div className='flex items-center gap-2'>
            <Input value={project.name} onChange={(e) => onNameChange(e.target.value)} className='font-bold' />
            <Link to={`/project/${project.id}`} title='Focus on this project'
               className='shrink-0 text-lg text-text-muted hover:text-text-primary'>⤢</Link>
         </div>
         <ProjectTasks project={project} />
         <Textarea placeholder='Brain dump...' value={project.notes} onChange={(e) => onNotesChange(e.target.value)} rows={4} />
      </div>
   )
}
