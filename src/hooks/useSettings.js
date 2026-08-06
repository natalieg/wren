import { useState, useEffect } from 'react'

const DEFAULT_SETTINGS = {
    rolloverHour: 4,
    rolloverActive: true,
}

function useSettings() {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('settings')
            // merges over defaults so a new setting added later still gets a
            // sane value for anyone with an older settings object already saved
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
        } catch (e) {
            console.error('Failed to load settings from localStorage:', e)
            return DEFAULT_SETTINGS
        }
    })

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings))
    }, [settings])

    const updateSetting = (key, value) => {
        setSettings(current => ({ ...current, [key]: value }))
    }

    return { settings, updateSetting }
}

export default useSettings
