export const SETTINGS_STORAGE_KEY = 'settings'

export const DEFAULT_SETTINGS = {
    rolloverHour: 4,
    rolloverActive: true,
}

// merges over defaults so a new setting added later still gets a sane value
// for anyone with an older settings object already saved
export function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch (e) {
        console.error('Failed to load settings from localStorage:', e)
        return DEFAULT_SETTINGS
    }
}
