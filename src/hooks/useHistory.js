// History is a SEPARATE localStorage entry ('history'), not derived from 'tasks'.
// Model: history tracks "is this task done", full stop. It does NOT care about
// deletion in useTasks' taskList — a task can be deleted from 'tasks' and stays
// in history forever. It only leaves history if it gets toggled back to "not done".
//
// Suggested shape — grouped by day, newest day first:
// [
//   { date: '2026-08-03', tasks: [{ id, label, trackedTime, finishedTimestamp }, ...] },
//   { date: '2026-08-02', tasks: [...] },
// ]
//
// OPEN QUESTION before you start (you flagged this yourself as "vielleicht"):
// there's no per-task "start time" anywhere in useTasks, only finishedTimestamp.
// useTasks.js *does* track a day-level `startedAt`, but it's stored under its own
// 'startedAt' key and gets overwritten every day — so it won't be there anymore
// once a day is history. If you want start/end per entry, decide now:
//   (a) capture the current startedAt into the entry at archive-time, or
//   (b) approximate start as the earliest task's (finishedTimestamp - trackedTime), or
//   (c) skip start/end for v1 and only show total time + task list

function useHistory() {
    // TODO 1: load 'history' from localStorage on init.
    // Mirror the pattern useTasks.js uses for loading 'tasks' (see useTasks.js:5-13):
    // useState(() => { try { ...JSON.parse(localStorage.getItem('history'))... } catch {...} })

    // TODO 2: persist to localStorage whenever the history state changes.
    // Same pattern as useTasks.js:27-29 (useEffect + localStorage.setItem).

    // TODO 3: addToHistory(task) — called from toggleDone when isNowDone === true.
    //   - figure out the day key from task.finishedTimestamp (formatDate() or
    //     toDateString())
    //   - if that day already has an entry, push/replace this task inside its
    //     `tasks` array (replace-by-id, so a done -> undone -> done cycle doesn't
    //     create a duplicate)
    //   - if it's a new day, create a new entry and put it at the front (history
    //     should stay newest-first)

    // TODO 4: removeFromHistory(taskId) — called from toggleDone when a task goes
    // back to "not done".
    //   - the task might not be under *today's* date anymore (toggled done
    //     yesterday, undone today), so search across all entries by task id,
    //     not just the current day
    //   - remove the task from whichever entry contains it; if that empties the
    //     entry's `tasks` array, decide whether to drop the now-empty day too

    // TODO 5: return { history, addToHistory, removeFromHistory }
}

export default useHistory
