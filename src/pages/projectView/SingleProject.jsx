import { useParams, Link } from 'react-router-dom'
import useProjectsContext from '../../hooks/useProjectsContext'
import DocWrapper from '../../components/DocWrapper'
import ProjectCard from './ProjectCard'

export default function SingleProject() {
   const { id } = useParams()
   const { projects, updateProjectName, updateProjectNotes } = useProjectsContext()
   const project = projects.find(p => p.id === id)

   if (!project) {
      return (
         <DocWrapper header='Project not found'>
            <Link to='/project' className='text-text-muted hover:text-text-primary'>← back to Projects</Link>
         </DocWrapper>
      )
   }

   return (
      <DocWrapper header={project.name} className='w-full'>
         <div className='w-full max-w-3xl flex flex-col gap-3'>
            <Link to='/project' className='text-sm text-text-muted hover:text-text-primary w-fit'>← back to Projects</Link>
            <ProjectCard project={project}
               onNameChange={(name) => updateProjectName(project.id, name)}
               onNotesChange={(notes) => updateProjectNotes(project.id, notes)} />
         </div>
      </DocWrapper>
   )
}
