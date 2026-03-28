export function computeGoal(item) {
    if (item.goaltype === 'accumulated' && item.subProjects?.length) {
        return item.subProjects.reduce((sum, sub) => sum + computeGoal(sub), 0)
    }
    return item.goal ?? 0
}

export function computeProgress(item) {
    if (item.progressType === 'accumulated' && item.subProjects?.length) {
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
