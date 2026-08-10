import { DONE, ACTIVE, BACKLOG, NEXTUP } from './constants'

// List transition rules: enter/leave callbacks transform the task.
// position: 'end' moves task to end of list. recurring.count tracks completions.
function countCompletion(task, delta) {
   if (!task.recurring || delta === 0) return task
   const count = Math.max(0, (task.recurring.count ?? 0) + delta)
   return { ...task, recurring: { ...task.recurring, count } }
}

export const listRules = {
   [DONE]: {
      // entering done increments completion count
      enter: (t, from) => countCompletion(
         { ...t, previousList: from, finishedTimestamp: new Date() }, 1),
      // leaving done decrements completion count
      leave: (t) => countCompletion(
         { ...t, previousList: undefined, finishedTimestamp: null }, -1),
   },
   [ACTIVE]: {
      // ACTIVE clears the bucket
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

// Apply list change to task (pure function)
export function applyListChange(task, target, opts = {}) {
   const from = task.list
   if (from === target) return task
   let next = { ...task, list: target }
   next = listRules[from]?.leave?.(next, target) ?? next
   next = listRules[target]?.enter?.(next, from, opts) ?? next
   return next
}

// Check if target list positions task at end
export function entersAtEnd(target) {
   return listRules[target]?.position === 'end'
}
