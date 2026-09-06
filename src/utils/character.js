export const CHARACTER_STORAGE_KEY = 'character'

export const DEFAULT_CHARACTER = {
    name: 'Unnamed',
    activated: false, 
    class: { id: 'Novice', level: 1, exp: 0, totalExp: 0 },
    hp: { current: 100, max: 100 },
    stats: {
        str: { level: 1, exp: 0 },
        agi: { level: 1, exp: 0 },
        vit: { level: 1, exp: 0 },
        int: { level: 1, exp: 0 },
        dex: { level: 1, exp: 0 },
        luk: { level: 1, exp: 0 },
    }
}

export function loadCharacter() {
    try {
        const saved = localStorage.getItem(CHARACTER_STORAGE_KEY)
        return saved ? { ...DEFAULT_CHARACTER, ...JSON.parse(saved) } : DEFAULT_CHARACTER
    } catch (e) {
        console.error('Failed to load character from localStorage:', e)
        return DEFAULT_CHARACTER
    }
}

const LEVEL_THRESHOLDS = [0, 10, 25, 45, 70]  // Index 0 = braucht für Level 2, usw. — Platzhalterwerte

export function getExpForNextLevel(level) {
    return LEVEL_THRESHOLDS[level] || level * 10  // Example leveling formula: next level requires 10 * current level experience points
}

const CLASS_LEVEL_THRESHOLDS = [0, 10, 25, 45, 70]

export function getExpForNextClassLevel(level) {
    return CLASS_LEVEL_THRESHOLDS[level] || level * 10
}
