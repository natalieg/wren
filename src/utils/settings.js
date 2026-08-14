export const SETTINGS_STORAGE_KEY = 'settings'

export const DEFAULT_SETTINGS = {
    rolloverHour: 4,
    // 'HH:mm' — the format <input type='time'> reads and writes natively,
    // parsed into a real timestamp in useDayActions, nowhere else
    defaultStartTime: '09:00',
    rolloverActive: true,
    autoDeleteFinished: false,
    timerSound: 'shortBell',
    timerSoundEnabled: true,
    finishedSoundEnabled: true,
    soundVolume: 0.7,
   // LATER users can add own break types through settings 
    breakTypes: [
        { id: 'break', name: 'break', emoji: '🍵', enabled: true, required: true },
        { id: 'gaming', name: 'gaming', emoji: '🎮', enabled: false },
        { id: 'social', name: 'social', emoji: '🫂', enabled: false },
    ],
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
