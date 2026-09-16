import { ACCUMULATED } from './constants'

export function computeGoal(item) {
    if (item.goaltype === ACCUMULATED && item.subProjects?.length) {
        return item.subProjects.reduce((sum, sub) => sum + computeGoal(sub), 0)
    }
    return item.goal ?? 0
}

export function computeProgress(item) {
    if (item.progressType === ACCUMULATED && item.subProjects?.length) {
        return item.subProjects.reduce((sum, sub) => sum + computeProgress(sub), 0)
    }
    return item.progress ?? 0
}

export function flattenGoals(goal, depth = 0) {
    const rows = [{ ...goal, depth }]
    if (goal.subProjects?.length) {
        for (const sub of goal.subProjects) {
            rows.push(...flattenGoals(sub, depth + 1))
        }
    }
    return rows
}

export function getBadgeColor(hoursPerWeek, totalHoursAllProjects) {
    const share = hoursPerWeek / totalHoursAllProjects
    if (share >= 0.5) return 'bg-emerald-900/60 border-emerald-600'    // Hauptprojekt, viel Gewicht
    if (share >= 0.3) return 'bg-emerald-900/30 border-emerald-800'  // Mittleres Projekt
    return 'bg-gray-600/60 border-gray-500'                     // Sideprojekt
}