import useProjectsContext from '../../hooks/useProjectsContext'
import DocWrapper from '../../components/DocWrapper'
import ProjectCard from './ProjectCard'
import NewProjectTile from './NewProjectTile'

export default function Project() {
   const { projects, addProject, updateProjectName, updateProjectNotes } = useProjectsContext()

   return (
      <DocWrapper header='Projects' className='w-full'>
         {/* max-w caps auto-fit at two 420px columns — three+ projects wrap to a new row
             instead of squeezing a third column in */}
         <div className='grid gap-4 w-full max-w-420' 
         style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 2fr))' }}>
            {projects.map(project => (
               <ProjectCard key={project.id} project={project}
                  onNameChange={(name) => updateProjectName(project.id, name)}
                  onNotesChange={(notes) => updateProjectNotes(project.id, notes)} />
            ))}
            <NewProjectTile onCreate={addProject} />
         </div>
      </DocWrapper>
   )
}
