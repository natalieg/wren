import ProjectsContext from './ProjectsContext'
import useProjects from '../hooks/useProjects'

// One shared useProjects() instance — the project page (writer) and task rows anywhere
// in the app (readers, resolving a task's project name) have to sit on the same state.
function ProjectsProvider({ children }) {
    const projectsValue = useProjects()

    return <ProjectsContext.Provider value={projectsValue}>
        {children}
    </ProjectsContext.Provider>
}

export default ProjectsProvider
