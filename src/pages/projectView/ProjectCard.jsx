import Textarea from '../../components/elements/Textarea'
import ProjectTasks from './ProjectTasks'

export default function ProjectCard({ project, onNotesChange }) {
   return (
      <div className='flex flex-col gap-3 p-4 rounded-sm border-(length:--border-w-thick) border-text-primary bg-surface'>
         <p className='text-lg font-bold'>{project.name}</p>
         <ProjectTasks project={project} />
         <Textarea placeholder='Brain dump...' value={project.notes} onChange={(e) => onNotesChange(e.target.value)} rows={4} />
      </div>
   )
}
