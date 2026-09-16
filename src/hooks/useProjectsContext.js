import { useContext } from 'react'
import ProjectsContext from '../context/ProjectsContext'

// Reading the shared project state.
function useProjectsContext() {
    const context = useContext(ProjectsContext)
    if (!context) throw new Error('useProjectsContext must be used within a ProjectsProvider')
    return context
}

export default useProjectsContext
