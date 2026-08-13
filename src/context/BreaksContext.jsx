import React from 'react'

// null default on purpose: it makes "used outside the provider" a loud error in
// useBreaksContext 
const BreaksContext = React.createContext(null)

export default BreaksContext
