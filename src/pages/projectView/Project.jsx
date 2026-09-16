import useProjectsContext from '../../hooks/useProjectsContext'
import DocWrapper from '../../components/DocWrapper'
import ProjectCard from './ProjectCard'
import NewProjectTile from './NewProjectTile'

export default function Project() {
   const { projects, addProject, updateProjectNotes } = useProjectsContext()

   return (
      <DocWrapper header='Projects' className='w-full'>
         <div className='grid gap-4 w-full' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))' }}>
            {projects.map(project => (
               <ProjectCard key={project.id} project={project}
                  onNotesChange={(notes) => updateProjectNotes(project.id, notes)} />
            ))}
            <NewProjectTile onCreate={addProject} />
         </div>
      </DocWrapper>
   )
}
