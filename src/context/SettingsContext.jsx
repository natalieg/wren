import React from 'react'

// null default on purpose: it makes "used outside the provider" a loud error in
// useSettingsContext
const SettingsContext = React.createContext(null)

export default SettingsContext
