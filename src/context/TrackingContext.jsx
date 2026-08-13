import React from 'react'

// null default on purpose: it makes "used outside the provider" a loud error in
// useTrackingContext 
const TrackingContext = React.createContext(null)

export default TrackingContext
