import { useContext } from 'react'
import SettingsContext from '../context/SettingsContext'

// Reading the shared settings state. 
function useSettingsContext() {
    const context = useContext(SettingsContext)
    if (!context) throw new Error('useSettingsContext must be used within a SettingsProvider')
    return context
}

export default useSettingsContext
