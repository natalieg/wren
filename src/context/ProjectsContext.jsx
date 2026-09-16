import React from 'react'

// null default on purpose: it makes "used outside the provider" a loud error in
// useProjectsContext
const ProjectsContext = React.createContext(null)

export default ProjectsContext
