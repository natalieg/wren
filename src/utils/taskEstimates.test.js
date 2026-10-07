import { describe, it, expect } from 'vitest'
import calculateEstimates from './taskEstimates'
import { ACTIVE, BACKLOG, DONE, NEXTUP, SOMEDAY } from './constants'

const NOW = new Date('2026-08-10T12:00:00.000Z').getTime()
const MINUTE = 60 * 1000

// startedAt an hour back, so `now` never wins the baseTime race unless a test wants it to
const defaults = {
   startedAt: new Date(NOW - 60 * MINUTE),
   newActionTime: null,
   runningTaskId: null,
   trackedSeconds: 0,
   now: NOW,
}

const run = (taskList, overrides = {}) =>
   calculateEstimates({ ...defaults, taskList, ...overrides })

describe('calculateEstimates', () => {
   it('cascades: each active task starts where the one above it ends', () => {
      const { openTasks } = run([
         { id: 1, label: 'A', time: 10, list: ACTIVE },
         { id: 2, label: 'B', time: 20, list: ACTIVE },
      ])

      expect(openTasks.map(t => t.estimate.getTime())).toEqual([
         defaults.startedAt.getTime() + 10 * MINUTE,
         defaults.startedAt.getTime() + 30 * MINUTE,
      ])
   })

   it('anchors the cascade to the newest finished task when there is one', () => {
      const finishedAt = new Date(NOW - 5 * MINUTE)
      const { openTasks } = run([
         { id: 1, label: 'Done', time: 10, list: DONE, finishedTimestamp: finishedAt.toISOString() },
         { id: 2, label: 'A', time: 10, list: ACTIVE },
      ])

      expect(openTasks[0].estimate.getTime()).toBe(finishedAt.getTime() + 10 * MINUTE)
   })

   // one NaN in the Math.max would poison every estimate on the page
   it('ignores finished tasks with a missing or unparseable finishedTimestamp', () => {
      const { openTasks } = run([
         { id: 1, label: 'Legacy done', time: 10, list: DONE },
         { id: 2, label: 'Broken done', time: 10, list: DONE, finishedTimestamp: 'not a date' },
         { id: 3, label: 'A', time: 10, list: ACTIVE },
      ])

      expect(openTasks[0].estimate.getTime()).toBe(defaults.startedAt.getTime() + 10 * MINUTE)
   })

   it('subtracts already tracked time from the remaining estimate', () => {
      const { openTasks } = run([
         { id: 1, label: 'A', time: 10, list: ACTIVE, trackedTime: 4 * 60 },
      ])

      expect(openTasks[0].estimate.getTime()).toBe(defaults.startedAt.getTime() + 6 * MINUTE)
   })

   describe('the running task', () => {
      it('is sorted to the front and estimated from now, not from baseTime', () => {
         const { openTasks } = run(
            [
               { id: 1, label: 'A', time: 10, list: ACTIVE },
               { id: 2, label: 'B', time: 15, list: ACTIVE },
            ],
            { runningTaskId: 2, trackedSeconds: 5 * 60 },
         )

         expect(openTasks.map(t => t.id)).toEqual([2, 1])
         expect(openTasks[0].estimate.getTime()).toBe(NOW + 10 * MINUTE) // 15 planned - 5 tracked
         expect(openTasks[1].estimate.getTime()).toBe(NOW + 20 * MINUTE) // cascades on top
      })

      it('lands on now once it is over its own budget, never in the past', () => {
         const { openTasks } = run(
            [{ id: 1, label: 'A', time: 10, list: ACTIVE }],
            { runningTaskId: 1, trackedSeconds: 30 * 60 },
         )

         expect(openTasks[0].estimate.getTime()).toBe(NOW)
      })
   })

   it('gives a non-running overspent task no remaining time instead of a negative one', () => {
      const { openTasks } = run([
         { id: 1, label: 'A', time: 10, list: ACTIVE, trackedTime: 30 * 60 },
      ])

      expect(openTasks[0].estimate.getTime()).toBe(defaults.startedAt.getTime())
   })

   describe('pinned tasks (fixedStart)', () => {
      // baseTime is NOW - 60, so pin offsets are relative to NOW
      const pinAt = (minutes) => new Date(NOW + minutes * MINUTE).toISOString()
      const start = defaults.startedAt.getTime()

      it('starts at its fixed time and reports the free gap before it', () => {
         const { openTasks } = run([
            { id: 1, label: 'A', time: 10, list: ACTIVE },
            { id: 2, label: 'Meeting', time: 30, list: ACTIVE, fixedStart: pinAt(0) },
         ])

         expect(openTasks.map(t => t.id)).toEqual([1, 2])
         expect(openTasks[1].pinned).toBe(true)
         expect(openTasks[1].freeMinutesBefore).toBe(50)
         expect(openTasks[1].estimate.getTime()).toBe(NOW + 30 * MINUTE)
      })

      it('moves a flexible task that would run into the pin behind it', () => {
         const { openTasks } = run([
            { id: 1, label: 'A', time: 30, list: ACTIVE },
            { id: 2, label: 'Meeting', time: 20, list: ACTIVE, fixedStart: pinAt(-40) },
         ])

         expect(openTasks.map(t => t.id)).toEqual([2, 1])
         expect(openTasks[0].freeMinutesBefore).toBe(20)
         expect(openTasks[1].estimate.getTime()).toBe(start + 70 * MINUTE)
      })

      it('keeps the flexible order — a short task does not jump ahead to fill the gap', () => {
         const { openTasks } = run([
            { id: 1, label: 'Long', time: 30, list: ACTIVE },
            { id: 2, label: 'Short', time: 5, list: ACTIVE },
            { id: 3, label: 'Meeting', time: 20, list: ACTIVE, fixedStart: pinAt(-40) },
         ])

         expect(openTasks.map(t => t.id)).toEqual([3, 1, 2])
      })

      it('orders pins by time, not by stored position', () => {
         const { openTasks } = run([
            { id: 1, label: 'Late', time: 10, list: ACTIVE, fixedStart: pinAt(60) },
            { id: 2, label: 'Early', time: 10, list: ACTIVE, fixedStart: pinAt(0) },
         ])

         expect(openTasks.map(t => t.id)).toEqual([2, 1])
      })

      it('never bumps the running task — the pin is flagged as a conflict instead', () => {
         const { openTasks } = run(
            [
               { id: 1, label: 'Running', time: 30, list: ACTIVE },
               { id: 2, label: 'Meeting', time: 10, list: ACTIVE, fixedStart: pinAt(10) },
            ],
            { runningTaskId: 1 },
         )

         expect(openTasks.map(t => t.id)).toEqual([1, 2])
         expect(openTasks[1].pinConflict).toBe(true)
         expect(openTasks[1].estimate.getTime()).toBe(NOW + 40 * MINUTE)
      })

      it('treats a running pin like any running task', () => {
         const { openTasks } = run(
            [{ id: 1, label: 'Meeting', time: 30, list: ACTIVE, fixedStart: pinAt(-10) }],
            { runningTaskId: 1 },
         )

         expect(openTasks[0].pinned).toBeFalsy()
         expect(openTasks[0].estimate.getTime()).toBe(NOW + 30 * MINUTE)
      })

      it('pins a habit to its daily time, even when fixedStart is from another day', () => {
         const habitTime = new Date(NOW).toTimeString().slice(0, 5) // NOW as local 'HH:mm'
         const { openTasks } = run([
            { id: 1, label: 'Standup', time: 15, list: ACTIVE, fixedStart: pinAt(-24 * 60),
               recurring: { active: true, id: 'h1', fixedTime: habitTime } },
         ])

         expect(openTasks[0].pinned).toBe(true)
         expect(openTasks[0].pinnedAt.getTime()).toBe(NOW)
      })

      it('ignores the daily time of a paused habit', () => {
         const { openTasks } = run([
            { id: 1, label: 'Standup', time: 15, list: ACTIVE,
               recurring: { active: false, id: 'h1', fixedTime: '14:00' } },
         ])

         expect(openTasks[0].pinned).toBeFalsy()
      })

      it('ignores a pin from another day', () => {
         const { openTasks } = run([
            { id: 1, label: 'Stale', time: 10, list: ACTIVE, fixedStart: pinAt(-24 * 60) },
         ])

         expect(openTasks[0].pinned).toBeFalsy()
         expect(openTasks[0].estimate.getTime()).toBe(start + 10 * MINUTE)
      })
   })

   describe('nextUp tasks', () => {
      it('anchors after the last active estimate and skips other buckets', () => {
         const { nextUpTasks } = run([
            { id: 1, label: 'A', time: 10, list: ACTIVE },
            { id: 2, label: 'Next', time: 20, list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } },
            { id: 3, label: 'Later', time: 20, list: BACKLOG, backlog: { bucket: SOMEDAY, activationDate: null } },
         ])

         expect(nextUpTasks.map(t => t.id)).toEqual([2])
         // active cascade ends in the past here, so `now` takes over as the anchor
         expect(nextUpTasks[0].possibleEstimate.getTime()).toBe(NOW + 20 * MINUTE)
      })

      it('treats a backlog task with no bucket as nextUp', () => {
         const { nextUpTasks } = run([
            { id: 1, label: 'Legacy parked', time: 5, list: BACKLOG },
         ])

         expect(nextUpTasks.map(t => t.id)).toEqual([1])
      })
   })
})
