import { describe, it, expect } from 'vitest'
import { applyListChange, entersAtEnd } from './taskTransitions'
import { ACTIVE, BACKLOG, DONE, NEXTUP, SOMEDAY } from './constants'

const activeTask = { id: 1, label: 'A', time: 10, list: ACTIVE }
const backlogTask = { id: 2, label: 'B', time: 10, list: BACKLOG, backlog: { bucket: SOMEDAY, activationDate: null } }

describe('applyListChange', () => {
   it('returns the same task when the target list is the current one', () => {
      expect(applyListChange(activeTask, ACTIVE)).toBe(activeTask)
   })

   describe('entering done', () => {
      it('records the list it came from and stamps the finish time', () => {
         const next = applyListChange(activeTask, DONE)
         expect(next.list).toBe(DONE)
         expect(next.previousList).toBe(ACTIVE)
         expect(next.finishedTimestamp).toBeInstanceOf(Date)
      })

      it('keeps the bucket of a parked task so un-finishing can put it back', () => {
         const next = applyListChange(backlogTask, DONE)
         expect(next.previousList).toBe(BACKLOG)
         expect(next.backlog).toMatchObject({ bucket: SOMEDAY })
      })
   })

   describe('leaving done', () => {
      // the bug this whole table exists for: any way out of done has to clear these,
      // not just the checkbox — the edit panel and drag & drop used to skip them
      it('clears finishedTimestamp and previousList on the way to active', () => {
         const done = applyListChange(activeTask, DONE)
         const next = applyListChange(done, ACTIVE)
         expect(next.list).toBe(ACTIVE)
         expect(next.finishedTimestamp).toBeNull()
         expect(next.previousList).toBeUndefined()
      })

      it('restores the original bucket when going back to the backlog', () => {
         const done = applyListChange(backlogTask, DONE)
         const next = applyListChange(done, BACKLOG)
         expect(next.finishedTimestamp).toBeNull()
         expect(next.backlog).toMatchObject({ bucket: SOMEDAY, activationDate: null })
      })
   })

   describe('backlog', () => {
      it('defaults to the nextUp bucket', () => {
         const next = applyListChange(activeTask, BACKLOG)
         expect(next.backlog).toEqual({ bucket: NEXTUP, activationDate: null })
      })

      it('takes an explicit bucket over the default', () => {
         const next = applyListChange(activeTask, BACKLOG, { bucket: SOMEDAY })
         expect(next.backlog).toMatchObject({ bucket: SOMEDAY })
      })

      it('carries activationDate through a done round trip, it belongs to the task', () => {
         const withDate = { ...backlogTask, backlog: { bucket: SOMEDAY, activationDate: '2026-09-01' } }
         const next = applyListChange(applyListChange(withDate, DONE), BACKLOG)
         expect(next.backlog).toEqual({ bucket: SOMEDAY, activationDate: '2026-09-01' })
      })

      it('is a no-op within the backlog — bucket changes are not a list change', () => {
         expect(applyListChange(backlogTask, BACKLOG, { bucket: NEXTUP })).toBe(backlogTask)
      })
   })

   it('clears the bucket when a parked task becomes active', () => {
      const next = applyListChange(backlogTask, ACTIVE)
      expect(next.list).toBe(ACTIVE)
      expect(next.backlog).toBeUndefined()
   })

   it('never mutates the task it was given', () => {
      const original = { ...activeTask }
      applyListChange(activeTask, DONE)
      expect(activeTask).toEqual(original)
   })
})

describe('entersAtEnd', () => {
   it('is true for active — re-joining the queue means joining at the back', () => {
      expect(entersAtEnd(ACTIVE)).toBe(true)
   })

   it('is false for lists that keep the task in place', () => {
      expect(entersAtEnd(BACKLOG)).toBe(false)
      expect(entersAtEnd(DONE)).toBe(false)
   })
})
