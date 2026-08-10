import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTasks from './useTasks'
import { ACTIVE, BACKLOG, NEXTUP, SOMEDAY, DONE, } from '../utils/constants'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a task', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.taskActions.handleAddTask('Write tests', 15)
    })

    expect(result.current.taskList).toHaveLength(1)
    expect(result.current.taskList[0]).toMatchObject({
      label: 'Write tests',
      time: 15,
      list: ACTIVE,
    })
  })

  it('marks a task done', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.taskActions.handleAddTask('Write tests', 15)
    })
    const id = result.current.taskList[0].id

    act(() => {
      result.current.taskActions.toggleDone(id)
    })

    expect(result.current.taskList[0].list).toBe(DONE)
    expect(result.current.finishedTasks).toHaveLength(1)
    expect(result.current.openTasks).toHaveLength(0)
  })

  it('un-marking done restores the task to its previous list', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.taskActions.handleAddTask('Write tests', 15) })
    const id = result.current.taskList[0].id

    act(() => { result.current.taskActions.toggleActive(id) }) // park it first
    act(() => { result.current.taskActions.toggleDone(id) })
    expect(result.current.taskList[0].list).toBe(DONE)

    act(() => { result.current.taskActions.toggleDone(id) }) // undo
    expect(result.current.taskList[0].list).toBe(BACKLOG)
  })

  // every way out of 'done' has to run the same cleanup. These used to only happen in
  // toggleDone, so the edit panel's active badge left a stale timestamp and history entry
  describe('leaving the done list through something other than the checkbox', () => {
    const readHistory = () => JSON.parse(localStorage.getItem('history') || '[]')

    it('the active badge clears finishedTimestamp and the history entry', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 15) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleDone(id) })
      expect(readHistory()[0].tasks).toHaveLength(1)

      act(() => { result.current.taskActions.toggleActive(id) })

      const task = result.current.taskList[0]
      expect(task.list).toBe(ACTIVE)
      expect(task.finishedTimestamp).toBeNull()
      expect(task.previousList).toBeUndefined()
      expect(result.current.finishedTasks).toHaveLength(0)
      expect(readHistory()).toHaveLength(0)
    })

    it('starting the timer on a finished task un-finishes it the same way', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 15) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleDone(id) })
      act(() => { result.current.taskActions.startTracking(id) })

      const task = result.current.taskList[0]
      expect(task.list).toBe(ACTIVE)
      expect(task.finishedTimestamp).toBeNull()
      expect(readHistory()).toHaveLength(0)
    })

    it('keeps the bucket across finishing and un-finishing a parked task', () => {
      const { result } = renderHook(() => useTasks())
      act(() => {
        result.current.taskActions.handleAddTask('Someday idea', 30, { list: BACKLOG, bucket: SOMEDAY })
      })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleDone(id) })
      act(() => { result.current.taskActions.toggleDone(id) })

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: SOMEDAY },
      })
    })
  })

  describe('legacy data migration', () => {
    it('migrates a legacy active task (active: true, done: false)', () => {
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Legacy active', time: 15, active: true, done: false }
      ]))
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0]).toMatchObject({ list: ACTIVE })
      expect(result.current.taskList[0].backlog).toBeUndefined()
      expect(result.current.taskList[0].active).toBeUndefined()
      expect(result.current.taskList[0].done).toBeUndefined()
    })

    it('migrates a legacy parked task (active: false, done: false) into backlog/nextUp', () => {
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Legacy parked', time: 15, active: false, done: false }
      ]))
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: NEXTUP, activationDate: null },
      })
    })

    it('migrates a legacy finished task (done: true) regardless of its active value', () => {
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Legacy finished, was parked', time: 15, active: false, done: true, finishedTimestamp: '2026-08-01T00:00:00.000Z' }
      ]))
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0]).toMatchObject({ list: DONE })
      expect(result.current.taskList[0].backlog).toBeUndefined()
    })

    it('migrates a pre-parking legacy task with no active field at all to backlog, not active', () => {
      // the old UI's filter was `t.active && !t.done` / `!t.done && !t.active` — any
      // falsy `active` (including missing/undefined) displayed as parked, so a task
      // from before the `active` field existed must migrate the same way, not to 'active'
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'From before parking existed', time: 15, done: false }
      ]))
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: NEXTUP },
      })
    })

    it('leaves already-migrated tasks untouched (idempotent, keeps a non-default bucket)', () => {
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Already new shape', time: 15, list: BACKLOG, backlog: { bucket: SOMEDAY, activationDate: null } }
      ]))
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: SOMEDAY },
      })
    })
  })

  describe('backlog', () => {
    it('parks a task into the backlog with a default nextUp bucket', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 15) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleActive(id) })

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: NEXTUP },
      })
      expect(result.current.nextUpTasks).toHaveLength(1)
      expect(result.current.backlogTasks).toHaveLength(1)
    })

    it('adds a task straight into the someday bucket, excluded from nextUpTasks', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.taskActions.handleAddTask('Someday idea', 30, { list: BACKLOG, bucket: SOMEDAY })
      })

      expect(result.current.taskList[0]).toMatchObject({
        list: BACKLOG,
        backlog: { bucket: SOMEDAY },
      })
      expect(result.current.backlogTasks).toHaveLength(1)
      expect(result.current.nextUpTasks).toHaveLength(0)
    })

    it('pulling a backlog task back to active clears its bucket', () => {
      const { result } = renderHook(() => useTasks())
      act(() => {
        result.current.taskActions.handleAddTask('Someday idea', 30, { list: BACKLOG, bucket: SOMEDAY })
      })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleActive(id) })

      expect(result.current.taskList[0].list).toBe(ACTIVE)
      expect(result.current.taskList[0].backlog).toBeUndefined()
    })

    it('activating a backlog task lands it at the end of the list, not its old spot', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Task A', 10) })
      act(() => { result.current.taskActions.handleAddTask('Task B', 10) })
      const idA = result.current.taskList[0].id
      const idB = result.current.taskList[1].id

      act(() => { result.current.taskActions.toggleActive(idA) }) // park A
      act(() => { result.current.taskActions.toggleActive(idA) }) // re-activate A

      expect(result.current.openTasks.map(t => t.id)).toEqual([idB, idA])
    })

    it('parking a task keeps it in-place (only activation repositions)', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Task A', 10) })
      act(() => { result.current.taskActions.handleAddTask('Task B', 10) })
      const idA = result.current.taskList[0].id

      act(() => { result.current.taskActions.toggleActive(idA) }) // park A

      expect(result.current.taskList[0].id).toBe(idA)
    })
  })

  describe('pushToBottom', () => {
    it('moves an active task to the end of the active list', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Task A', 10) })
      act(() => { result.current.taskActions.handleAddTask('Task B', 10) })
      act(() => { result.current.taskActions.handleAddTask('Task C', 10) })
      const [idA, idB, idC] = result.current.taskList.map(t => t.id)

      act(() => { result.current.taskActions.pushToBottom(idA) })

      expect(result.current.openTasks.map(t => t.id)).toEqual([idB, idC, idA])
    })
  })

  describe('rollover', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('promotes nextUp backlog tasks to active when the logical day has moved on', () => {
      vi.setSystemTime(new Date('2026-08-06T10:00:00'))
      localStorage.setItem('startedAt', new Date('2026-08-05T10:00:00').toISOString())
      localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, rolloverActive: true }))
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Someday idea', time: 15, list: BACKLOG, backlog: { bucket: SOMEDAY, activationDate: null } },
        { id: 2, label: 'Next up idea', time: 15, list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } },
      ]))

      const { result } = renderHook(() => useTasks())

      const promoted = result.current.taskList.find(t => t.id === 2)
      const untouched = result.current.taskList.find(t => t.id === 1)
      expect(promoted).toMatchObject({ list: ACTIVE })
      expect(promoted.backlog).toBeUndefined()
      expect(untouched.list).toBe(BACKLOG) // someday isn't touched by rollover
    })

    it('deletes finished tasks on rollover when autoDeleteFinished is enabled', () => {
      vi.setSystemTime(new Date('2026-08-06T10:00:00'))
      localStorage.setItem('startedAt', new Date('2026-08-05T10:00:00').toISOString())
      localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, autoDeleteFinished: true }))
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Finished yesterday', time: 15, list: DONE, finishedTimestamp: '2026-08-05T12:00:00.000Z' },
        { id: 2, label: 'Still open', time: 15, list: ACTIVE },
      ]))

      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList.map(t => t.id)).toEqual([2])
      expect(result.current.finishedTasks).toHaveLength(0)
    })

    it('keeps finished tasks on rollover when autoDeleteFinished is disabled', () => {
      vi.setSystemTime(new Date('2026-08-06T10:00:00'))
      localStorage.setItem('startedAt', new Date('2026-08-05T10:00:00').toISOString())
      localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, autoDeleteFinished: false }))
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Finished yesterday', time: 15, list: DONE, finishedTimestamp: '2026-08-05T12:00:00.000Z' },
      ]))

      const { result } = renderHook(() => useTasks())

      expect(result.current.finishedTasks).toHaveLength(1)
    })

    it('does not promote anything when rolloverActive is disabled in settings', () => {
      vi.setSystemTime(new Date('2026-08-06T10:00:00'))
      localStorage.setItem('startedAt', new Date('2026-08-05T10:00:00').toISOString())
      localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, rolloverActive: false }))
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Next up idea', time: 15, list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } },
      ]))

      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0].list).toBe(BACKLOG)
    })

    it('does nothing while still the same logical day (rolloverHour-shifted)', () => {
      vi.setSystemTime(new Date('2026-08-06T10:00:00'))
      const sameLogicalDayEarlier = new Date('2026-08-06T05:00:00')
      localStorage.setItem('startedAt', sameLogicalDayEarlier.toISOString())
      localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, rolloverActive: true }))
      localStorage.setItem('tasks', JSON.stringify([
        { id: 1, label: 'Next up idea', time: 15, list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } },
      ]))

      const { result } = renderHook(() => useTasks())

      expect(result.current.taskList[0].list).toBe(BACKLOG)
      expect(result.current.startedAt.toISOString()).toBe(sameLogicalDayEarlier.toISOString())
    })
  })

  describe('time tracking', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('ticks trackedSeconds once per second while a task is running', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 10) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.startTracking(id) })
      act(() => { vi.advanceTimersByTime(5000) })

      expect(result.current.runningTaskId).toBe(id)
      expect(result.current.trackedSeconds).toBe(5)
    })

    it('flushes tracked time into the task on stop, exactly once', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 10) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.startTracking(id) })
      act(() => { vi.advanceTimersByTime(5000) })
      act(() => { result.current.taskActions.stopTracking() })

      expect(result.current.runningTaskId).toBe(null)
      expect(result.current.trackedSeconds).toBe(0)
      expect(result.current.taskList.find(t => t.id === id).trackedTime).toBe(5)
    })

    it('flushes the previous task before switching to a new one', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Task A', 10) })
      const idA = result.current.taskList[0].id

      act(() => { result.current.taskActions.handleAddTask('Task B', 10) })
      const idB = result.current.taskList.find(t => t.id !== idA).id

      act(() => { result.current.taskActions.startTracking(idA) })
      act(() => { vi.advanceTimersByTime(7000) })
      act(() => { result.current.taskActions.startTracking(idB) })

      expect(result.current.runningTaskId).toBe(idB)
      expect(result.current.trackedSeconds).toBe(0)
      expect(result.current.taskList.find(t => t.id === idA).trackedTime).toBe(7)
    })

    // Note: the 5-minute failsafe interval itself isn't covered here — simulating
    // 5+ real minutes via fake timers hits a known rough edge where React's effect
    // commits don't interleave with a fully fake-timer-driven clock the way real
    // setInterval firings would. Its actual flush math is the same flushTrackedTime
    // exercised by the stop/switch tests above; verified manually by shortening the
    // interval during dev (see conversation 2026-08-01).

    // the transition and the flush both write the task in one handler — if the
    // transition uses a render snapshot instead of a functional update it wins the
    // race and the banked seconds are gone
    it('banks the running timer when the task is finished mid-run', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 10) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.startTracking(id) })
      act(() => { vi.advanceTimersByTime(5000) })
      act(() => { result.current.taskActions.toggleDone(id) })

      expect(result.current.runningTaskId).toBe(null)
      expect(result.current.taskList.find(t => t.id === id)).toMatchObject({
        list: DONE,
        trackedTime: 5,
      })
    })

    it('banks the running timer when the task is parked mid-run', () => {
      const { result } = renderHook(() => useTasks())
      act(() => { result.current.taskActions.handleAddTask('Write tests', 10) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.startTracking(id) })
      act(() => { vi.advanceTimersByTime(4000) })
      act(() => { result.current.taskActions.toggleActive(id) })

      expect(result.current.runningTaskId).toBe(null)
      expect(result.current.taskList.find(t => t.id === id)).toMatchObject({
        list: BACKLOG,
        trackedTime: 4,
      })
    })

    it("anchors the running task's estimate to now once it goes over its own time budget", () => {
      vi.setSystemTime(new Date('2026-08-01T12:00:00Z'))

      const { result } = renderHook(() => useTasks()) // 1-minute task
      act(() => { result.current.taskActions.handleAddTask('Write tests', 1) })
      const id = result.current.taskList[0].id

      act(() => { result.current.taskActions.startTracking(id) })
      act(() => { vi.advanceTimersByTime(90 * 1000) }) // 90s tracked, over the 60s estimate

      expect(result.current.openTasks[0].estimate.getTime()).toBe(Date.now())
    })
  })

  // dragging across the finished line can't be a plain list change — it has to go
  // through toggleDone, which is what writes finishedTimestamp and the history entry
  describe('dragging onto and out of the finished list', () => {
    const addTasks = (result, labels) => {
      for (const label of labels) {
        act(() => { result.current.taskActions.handleAddTask(label, 10) })
      }
      return labels.map(label => result.current.taskList.find(t => t.id != null && t.label === label).id)
    }

    it('dropping a task onto a finished one finishes it, with history', () => {
      const { result } = renderHook(() => useTasks())
      const [idA, idB] = addTasks(result, ['A', 'B'])

      act(() => { result.current.taskActions.toggleDone(idB) })
      act(() => { result.current.taskActions.reorderTaskList(idA, idB) })

      expect(result.current.taskList.find(t => t.id === idA)).toMatchObject({ list: DONE })
      expect(result.current.taskList.find(t => t.id === idA).finishedTimestamp).toBeTruthy()
      expect(result.current.finishedTasks).toHaveLength(2)
    })

    // the risky half: toggleDone restores previousList, so the task has to be placed
    // afterwards or it lands in whichever list it happened to come from
    it('dropping a finished task onto an active one un-finishes it into that list', () => {
      const { result } = renderHook(() => useTasks())
      const [idA, idB] = addTasks(result, ['A', 'B'])

      act(() => { result.current.taskActions.toggleActive(idA) }) // park it, so previousList is backlog
      act(() => { result.current.taskActions.toggleDone(idA) })
      expect(result.current.finishedTasks).toHaveLength(1)

      act(() => { result.current.taskActions.reorderTaskList(idA, idB) })

      expect(result.current.taskList.find(t => t.id === idA)).toMatchObject({ list: ACTIVE })
      expect(result.current.finishedTasks).toHaveLength(0)
      expect(result.current.openTasks.map(t => t.id)).toContain(idA)
    })
  })
})
