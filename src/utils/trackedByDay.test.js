import { describe, it, expect } from 'vitest'
import { addTrackedToday } from './trackedByDay'

const morning = new Date(2026, 9, 20, 10, 0).getTime()
const today = new Date(2026, 9, 20).toDateString()

describe('addTrackedToday', () => {
   it('adds onto today, keeping other days', () => {
      const task = { trackedByDay: { 'Fri Oct 16 2026': 300, [today]: 60 } }
      expect(addTrackedToday(task, 120, morning, 4).trackedByDay).toEqual({ 'Fri Oct 16 2026': 300, [today]: 180 })
   })

   it('starts the split on a legacy task without one', () => {
      expect(addTrackedToday({ trackedTime: 999 }, 60, morning, 4).trackedByDay).toEqual({ [today]: 60 })
   })

   it('books time before the rollover hour on the previous day', () => {
      const lateNight = new Date(2026, 9, 21, 2, 0).getTime()
      expect(addTrackedToday({}, 60, lateNight, 4).trackedByDay).toEqual({ [today]: 60 })
   })

   it('takes a correction downwards from today, never below 0', () => {
      expect(addTrackedToday({ trackedByDay: { [today]: 100 } }, -500, morning, 4).trackedByDay).toEqual({ [today]: 0 })
   })
})
