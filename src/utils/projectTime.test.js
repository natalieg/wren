import { describe, it, expect } from 'vitest'
import { projectWeekMinutes } from './projectTime'
import { ACTIVE, DONE } from './constants'

// Wednesday — the week started Monday 2026-10-19
const now = new Date(2026, 9, 21, 12, 0).getTime()
const day = (d) => new Date(2026, 9, d).toDateString()
const t = (id, project, minutes, extra = {}) => ({ id, project, trackedTime: minutes * 60, list: ACTIVE, ...extra })

describe('projectWeekMinutes', () => {
   const history = [
      { date: day(20), tasks: [t(1, 'p', 30, { list: DONE }), t(2, 'other', 99, { list: DONE })] },
      { date: day(18), tasks: [t(3, 'p', 45, { list: DONE })] }, // Sunday, last week
   ]

   it('sums this week of history plus open tasks and blocks, without counting finished ones twice', () => {
      const taskList = [t(1, 'p', 30, { list: DONE }), t(4, 'p', 10), t(5, 'p', 15, { kind: 'block' }), t(6, 'other', 50)]
      expect(projectWeekMinutes('p', { history, taskList, runningTaskId: null, trackedSeconds: 0, now })).toBe(30 + 10 + 15)
   })

   it('adds the running timer of the project', () => {
      const taskList = [t(4, 'p', 10)]
      expect(projectWeekMinutes('p', { history: [], taskList, runningTaskId: 4, trackedSeconds: 120, now })).toBe(12)
   })
})
