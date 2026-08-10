import { describe, it, expect } from 'vitest'
import { isRecurring, nextOccurrence, hasOtherOccurrence, hasOpenOccurrence, reviveOrphanedHabits } from './recurring'
import { ACTIVE, BACKLOG, DONE, NEXTUP, SOMEDAY } from './constants'

const habitTask = (overrides = {}) => ({
   id: 1,
   label: 'Yoga',
   time: 15,
   list: DONE,
   trackedTime: 2700,
   finishedTimestamp: '2026-08-10T18:00:00.000Z',
   startedAt: '2026-08-10T17:15:00.000Z',
   previousList: ACTIVE,
   recurring: { active: true, id: 'habit-1', count: 3 },
   ...overrides,
})

describe('isRecurring', () => {
   it('is false for a paused habit, so it can rest without losing its tasks', () => {
      expect(isRecurring(habitTask({ recurring: { active: false, id: 'habit-1' } }))).toBe(false)
   })

   it('is false for a plain task and for nothing at all', () => {
      expect(isRecurring(habitTask({ recurring: undefined }))).toBe(false)
      expect(isRecurring(undefined)).toBe(false)
   })
})

describe('nextOccurrence', () => {
   it('carries what the habit defines and nothing from the round that ended', () => {
      const next = nextOccurrence(habitTask())

      expect(next).toMatchObject({ label: 'Yoga', time: 15, list: ACTIVE })
      expect(next.recurring).toEqual({ active: true, id: 'habit-1', count: 3 })
      expect(next.trackedTime).toBeUndefined()
      expect(next.finishedTimestamp).toBeUndefined()
      expect(next.startedAt).toBeUndefined()
      expect(next.previousList).toBeUndefined()
   })

   // its own id is what keeps yesterday's history entry unreachable from today's task
   it('gets a fresh task id but keeps the habit id', () => {
      const next = nextOccurrence(habitTask())
      expect(next.id).not.toBe(1)
      expect(next.recurring.id).toBe('habit-1')
   })

   it('can be parked in a bucket instead of going straight to the day list', () => {
      const next = nextOccurrence(habitTask(), { list: BACKLOG, bucket: NEXTUP })
      expect(next).toMatchObject({ list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } })
   })
})

describe('occurrence lookups', () => {
   it('hasOtherOccurrence ignores the task being asked about', () => {
      const task = habitTask()
      expect(hasOtherOccurrence([task], task)).toBe(false)
      expect(hasOtherOccurrence([task, habitTask({ id: 2 })], task)).toBe(true)
   })

   it('hasOpenOccurrence only counts tasks that are not finished', () => {
      expect(hasOpenOccurrence([habitTask()], 'habit-1')).toBe(false)
      expect(hasOpenOccurrence([habitTask({ id: 2, list: ACTIVE })], 'habit-1')).toBe(true)
   })

   it('never matches on a missing habit id', () => {
      expect(hasOpenOccurrence([habitTask({ list: ACTIVE })], undefined)).toBe(false)
   })
})

// clearing out finished tasks is routine housekeeping; ending a recurrence while doing
// it is not, so a habit losing its last task gets a replacement
describe('reviveOrphanedHabits', () => {
   const parked = { list: BACKLOG, bucket: SOMEDAY }

   it('replaces a habit whose last task is being removed', () => {
      const revived = reviveOrphanedHabits([], [habitTask()], parked)

      expect(revived).toHaveLength(1)
      expect(revived[0]).toMatchObject({ label: 'Yoga', list: BACKLOG })
      expect(revived[0].backlog.bucket).toBe(SOMEDAY)
   })

   it('replaces nothing when the habit still has a task elsewhere', () => {
      const survivor = habitTask({ id: 2, list: ACTIVE })
      expect(reviveOrphanedHabits([survivor], [habitTask()], parked)).toEqual([])
   })

   it('makes one replacement when several finished days go at once', () => {
      const removed = [habitTask(), habitTask({ id: 2 }), habitTask({ id: 3 })]
      expect(reviveOrphanedHabits([], removed, parked)).toHaveLength(1)
   })

   it('keeps habits apart', () => {
      const other = habitTask({ id: 2, recurring: { active: true, id: 'habit-2', count: 0 } })
      expect(reviveOrphanedHabits([], [habitTask(), other], parked)).toHaveLength(2)
   })

   it('leaves paused habits and plain tasks to be deleted', () => {
      const paused = habitTask({ id: 2, recurring: { active: false, id: 'habit-2' } })
      const plain = habitTask({ id: 3, recurring: undefined })
      expect(reviveOrphanedHabits([], [paused, plain], parked)).toEqual([])
   })
})
