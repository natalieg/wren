import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useTasks from './useTasks'
import { ACTIVE, DONE } from '../utils/constants'

// The rollover runs once on mount, when the stored startedAt belongs to an earlier
// logical day — so seeding that plus the task list is the whole harness.
const seedSettings = (overrides = {}) =>
   localStorage.setItem('settings', JSON.stringify({
      rolloverHour: 4,
      defaultStartTime: '09:00',
      rolloverActive: true,
      autoDeleteFinished: false,
      ...overrides,
   }))

const seedYesterday = () =>
   localStorage.setItem('startedAt', new Date('2026-08-10T10:00:00').toISOString())

const seedTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks))

const finishedHabit = (overrides = {}) => ({
   id: 1,
   label: 'Yoga',
   time: 15,
   list: DONE,
   finishedTimestamp: '2026-08-10T18:00:00.000Z',
   trackedTime: 2700, // 45 minutes done yesterday
   startedAt: '2026-08-10T17:15:00.000Z',
   previousList: ACTIVE,
   recurring: { active: true, id: 'habit-1', count: 3 },
   ...overrides,
})

const rollOver = () => {
   vi.setSystemTime(new Date('2026-08-11T09:30:00'))
   seedYesterday()
   return renderHook(() => useTasks())
}

const openTaskFor = (result, habitId) =>
   result.current.taskList.find(t => t.list !== DONE && t.recurring?.id === habitId)

describe('recurring tasks on rollover', () => {
   beforeEach(() => {
      localStorage.clear()
      vi.useFakeTimers()
      seedSettings()
   })

   afterEach(() => {
      vi.useRealTimers()
   })

   it('adds a fresh task and leaves the finished one exactly as it was', () => {
      seedTasks([finishedHabit()])
      const { result } = rollOver()

      expect(result.current.taskList).toHaveLength(2)
      expect(result.current.finishedTasks).toHaveLength(1)
      expect(result.current.finishedTasks[0]).toMatchObject({ id: 1, trackedTime: 2700 })
   })

   it('copies what the habit defines and nothing about yesterday', () => {
      seedTasks([finishedHabit()])
      const copy = openTaskFor(rollOver().result, 'habit-1')

      expect(copy).toMatchObject({ label: 'Yoga', time: 15, list: ACTIVE })
      expect(copy.recurring).toEqual({ active: true, id: 'habit-1', count: 3 })
      expect(copy.trackedTime).toBeUndefined()
      expect(copy.finishedTimestamp).toBeUndefined()
      expect(copy.startedAt).toBeUndefined()
      expect(copy.previousList).toBeUndefined()
   })

   // the id is what keeps yesterday's history entry unreachable from today's task
   it('gives the copy its own task id', () => {
      seedTasks([finishedHabit()])
      const copy = openTaskFor(rollOver().result, 'habit-1')

      expect(copy.id).not.toBe(1)
      expect(typeof copy.id).toBe('string')
   })

   it('leaves a finished task that is not recurring alone', () => {
      seedTasks([{ ...finishedHabit(), recurring: undefined }])
      const { result } = rollOver()

      expect(result.current.taskList).toHaveLength(1)
      expect(result.current.taskList[0].list).toBe(DONE)
   })

   it('leaves a recurring task that was switched off alone', () => {
      seedTasks([finishedHabit({ recurring: { active: false, id: 'habit-1', count: 3 } })])
      const { result } = rollOver()

      expect(result.current.taskList).toHaveLength(1)
   })

   // without this guard a finished task that never gets auto-deleted would spawn a
   // copy every single day
   it('makes no copy when the habit already has an unfinished task', () => {
      seedTasks([
         finishedHabit(),
         { id: 2, label: 'Yoga', time: 15, list: ACTIVE, recurring: { active: true, id: 'habit-1', count: 3 } },
      ])
      const { result } = rollOver()

      expect(result.current.taskList).toHaveLength(2)
   })

   it('makes one copy when the same habit was finished on several days', () => {
      seedTasks([finishedHabit(), finishedHabit({ id: 2 })])
      const { result } = rollOver()

      expect(result.current.taskList).toHaveLength(3)
      expect(result.current.taskList.filter(t => t.list === ACTIVE)).toHaveLength(1)
   })

   it('copies before the finished tasks are deleted', () => {
      seedSettings({ autoDeleteFinished: true })
      seedTasks([finishedHabit()])
      const { result } = rollOver()

      expect(result.current.finishedTasks).toHaveLength(0)
      expect(openTaskFor(result, 'habit-1')).toMatchObject({ label: 'Yoga', list: ACTIVE })
   })
})
