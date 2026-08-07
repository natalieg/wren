import { useState, useEffect } from 'react'
import { SETTINGS_STORAGE_KEY, loadSettings } from '../utils/settings'

function useSettings() {
    const [settings, setSettings] = useState(loadSettings)

    useEffect(() => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    }, [settings])

    const updateSetting = (key, value) => {
        setSettings(current => ({ ...current, [key]: value }))
    }

    return { settings, updateSetting }
}

export default useSettings
