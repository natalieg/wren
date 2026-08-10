import { DONE, ACTIVE, BACKLOG, NEXTUP } from './constants'

// What entering or leaving a list means for the task itself, one block per list.
// A new list adds its own block and never touches the existing ones — the rules are
// per-list on purpose, never per from/to pair, or this grows quadratically.
//
// enter(task, from, opts) / leave(task, to) both return a task.
// position: 'end' means entering this list also moves the task to the end of taskList.
export const listRules = {
   [DONE]: {
      enter: (t, from) => ({ ...t, previousList: from, finishedTimestamp: new Date() }),
      leave: (t) => ({ ...t, previousList: undefined, finishedTimestamp: null }),
   },
   [ACTIVE]: {
      // clearing the bucket is ACTIVE's job, not BACKLOG's: a parked task that gets
      // finished has to keep its bucket so un-finishing can put it back where it was
      enter: (t) => ({ ...t, backlog: undefined }),
      position: 'end',
   },
   [BACKLOG]: {
      enter: (t, from, opts = {}) => ({
         ...t,
         backlog: {
            bucket: opts.bucket ?? t.backlog?.bucket ?? NEXTUP,
            activationDate: t.backlog?.activationDate ?? null,
         },
      }),
   },
}

// the single place that knows what a list change does to a task. Pure — the side
// effects around it (history entry, stopping the timer) live in useTasks
export function applyListChange(task, target, opts = {}) {
   const from = task.list
   if (from === target) return task
   let next = { ...task, list: target }
   next = listRules[from]?.leave?.(next, target) ?? next
   next = listRules[target]?.enter?.(next, from, opts) ?? next
   return next
}

// position is a list concern, not a task concern, so it can't come out of enter()
export function entersAtEnd(target) {
   return listRules[target]?.position === 'end'
}
