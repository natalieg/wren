import React from 'react'

// null default on purpose: it makes "used outside the provider" a loud error in
// useHistoryContext
const HistoryContext = React.createContext(null)

export default HistoryContext
