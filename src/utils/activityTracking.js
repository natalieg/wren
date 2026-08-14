/** The one place that knows a task timer and a break timer can never run at the same
 * time. Both sides own their own tracking; neither should know about the other, so
 * the rule lives here instead of inside useTasks or useBreakTracking.
 * Pure on purpose — no React, so it's testable without rendering a provider tree. */
// takes both sides' current state + raw actions, returns the coordinated ones
export function buildActivityActions({ runningTaskId, runningBreakId, taskActions, breakActions }) {
    const startTracking = (id) => {
        if (runningBreakId) breakActions.stopBreak()
        taskActions.startTracking(id)
    }

    // stops a running break of a different type too — startBreak doesn't flush on its
    // own, it just restarts the clock, so a switch without this drops the elapsed time
    const startBreak = (breakType) => {
        if (runningTaskId) taskActions.stopTracking()
        if (runningBreakId) breakActions.stopBreak()
        breakActions.startBreak(breakType)
    }

    return {
        startTracking,
        stopTracking: taskActions.stopTracking,
        startBreak,
        stopBreak: breakActions.stopBreak,
    }
}
