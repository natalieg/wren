import { describe, it, expect } from 'vitest'
import { projectWeekLog, projectWeekMinutes } from './projectTime'
import { ACTIVE, BACKLOG, DONE } from './constants'

// Wednesday — the week started Monday 2026-10-19
const now = new Date(2026, 9, 21, 12, 0).getTime()
const day = (d) => new Date(2026, 9, d).toDateString()
const at = (d) => new Date(2026, 9, d, 15, 0).toISOString()
const t = (id, project, extra = {}) => ({ id, label: `task ${id}`, project, time: 20, list: ACTIVE, ...extra })
const ctx = (history, taskList, extra = {}) => ({ history, taskList, runningTaskId: null, trackedSeconds: 0, now, ...extra })

describe('projectWeekMinutes', () => {
   it('counts only the days of this week, wherever the task sits', () => {
      const parked = t(1, 'p', { list: BACKLOG, trackedTime: 3 * 3600, trackedByDay: { [day(16)]: 2 * 3600, [day(20)]: 3600 } })
      expect(projectWeekMinutes('p', ctx([], [parked]))).toBe(60)
   })

   it('leaves undated old time of open tasks out, but shows it in the log', () => {
      const legacy = t(1, 'p', { trackedTime: 2 * 3600 })
      expect(projectWeekMinutes('p', ctx([], [legacy]))).toBe(0)
      expect(projectWeekLog('p', ctx([], [legacy]))[0].undatedMinutes).toBe(120)
   })

   it('keeps undated time out after finishing too, so the number never jumps on a tick', () => {
      const thisWeek = t(1, 'p', { list: DONE, trackedTime: 30 * 60, finishedTimestamp: at(20) })
      const lastWeek = t(2, 'p', { list: DONE, trackedTime: 45 * 60, finishedTimestamp: at(17) })
      const history = [{ date: day(20), tasks: [thisWeek] }, { date: day(17), tasks: [lastWeek] }]
      const log = projectWeekLog('p', ctx(history, []))
      expect(projectWeekMinutes('p', ctx(history, []))).toBe(0)
      // last week's finished task is nobody's business this week
      expect(log.map(e => [e.id, e.undatedMinutes])).toEqual([[1, 30]])
   })

   it('counts a finished task without tracking by its estimate, like History does', () => {
      const untracked = t(1, 'p', { list: DONE, time: 25, finishedTimestamp: at(21) })
      expect(projectWeekMinutes('p', ctx([{ date: day(21), tasks: [untracked] }], []))).toBe(25)
   })

   it('never counts a task twice when it is both in history and on the list', () => {
      const done = t(1, 'p', { list: DONE, trackedTime: 600, trackedByDay: { [day(21)]: 600 }, finishedTimestamp: at(21) })
      expect(projectWeekMinutes('p', ctx([{ date: day(21), tasks: [done] }], [done]))).toBe(10)
   })

   it('adds the running timer and block general time, ignores other projects', () => {
      const taskList = [
         t(1, 'p', { trackedTime: 600, trackedByDay: { [day(21)]: 600 } }),
         t(2, 'p', { kind: 'block', trackedTime: 900, trackedByDay: { [day(21)]: 900 } }),
         t(3, 'other', { trackedTime: 3000, trackedByDay: { [day(21)]: 3000 } }),
      ]
      expect(projectWeekMinutes('p', ctx([], taskList, { runningTaskId: 1, trackedSeconds: 120 }))).toBe(10 + 2 + 15)
   })
})
