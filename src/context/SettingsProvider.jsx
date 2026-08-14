import SettingsContext from './SettingsContext'
import useSettings from '../hooks/useSettings'

// One shared useSettings() instance instead of one per consumer — without this,
// Settings.jsx and PausePanel each hold their own copy of the state, so a change
// in one only reaches the other after a remount (e.g. F5) re-reads localStorage.
function SettingsProvider({ children }) {
    const settingsValue = useSettings()

    return <SettingsContext.Provider value={settingsValue}>
        {children}
    </SettingsContext.Provider>
}

export default SettingsProvider
