import { useState, useEffect } from 'react'
import useHistory from './useHistory'
import useTimeTracking from './useTimeTracking'
import useTaskRollover from './useTaskRollover'
import { DONE, ACTIVE, BACKLOG, NEXTUP } from '../utils/constants'
import reorderTasks, { groupKey, isGroupKey } from '../utils/reorderTasks'
import { applyListChange, entersAtEnd } from '../utils/taskTransitions'
import calculateEstimates from '../utils/taskEstimates'
import { newTaskId } from '../utils/taskId'

// migrates legacy active/done booleans to the single 'list' enum, once, on load
// later remove at some point when all legacy tasks are gone
function normalizeTask(t) {
  if (t.list) return t
  // old UI treated any falsy `active` as parked (t.active && !t.done), not just
  // literal false — tasks from before the `active` field existed (pre-2026-07-29)
  // have active: undefined and were shown as parked, so this must match that, not === false
  const list = t.done ? DONE : !t.active ? BACKLOG : ACTIVE
  const { active: _active, done: _done, ...rest } = t
  return {
    ...rest,
    list,
    ...(list === BACKLOG ? { backlog: { bucket: NEXTUP, activationDate: null } } : {})
  }
}

/** Composition root for everything task-shaped. The pieces that own their own state
 * or effects are their own hooks (tracking, rollover); the parts that are just
 * "tasks in, something out" are pure utils (transitions, estimates, reordering).
 * What stays here is the task list itself, CRUD, and the wiring between them. */
function useTasks() {
  const { addToHistory, removeFromHistory } = useHistory()
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [taskList, setTaskList] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks).map(normalizeTask) : []
    } catch (e) {
      console.error('Failed to load tasks from localStorage:', e)
      return []
    }
  })
  const [newActionTime, setNewActionTime] = useState(null)

  const {
    runningTaskId,
    trackedSeconds,
    startTracking: beginTracking,
    stopTracking,
    stopIfRunning,
  } = useTimeTracking(setTaskList)

  const { startedAt, resetStartedAt } = useTaskRollover(setTaskList)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList))
  }, [taskList])

   // moves a task to a different list, applying the transition and cleaning up
  const moveTaskToList = (id, target, opts = {}) => {
    const task = taskList.find(t => t.id === id)
    if (!task || task.list === target) return
    const next = applyListChange(task, target, opts)

    if (task.list === DONE) removeFromHistory(id)
    // the entry misses seconds still sitting in the running timer — the flush below
    // can only land on the next render. Known, pre-dates the transition rewrite
    if (target === DONE) addToHistory(next)

    setTaskList(currentTaskList => entersAtEnd(target)
      ? [...currentTaskList.filter(t => t.id !== id), next]
      : currentTaskList.map(t => t.id === id ? next : t))

    // after setTaskList on purpose: the flush is a functional update and has to land
    // on top of the transition instead of being overwritten by it
    stopIfRunning(id)
  }

  const updateActionTime = () => {
    if (!taskList.some(t => t.list === ACTIVE)) {
      setNewActionTime(new Date())
    }
  }

  // un-finishing goes back to whichever list the task came from, falling back to active
  // for legacy tasks that never recorded one
  const toggleDone = (id) => {
    const task = taskList.find(t => t.id === id)
    if (!task) return
    if (task.list !== DONE) return moveTaskToList(id, DONE)
    const back = task.previousList && task.previousList !== DONE ? task.previousList : ACTIVE
    moveTaskToList(id, back)
  }

  // parks a task to the backlog or pulls it back to active. Works on a finished task
  // too — moveTaskToList runs the done cleanup (timestamp, history) on the way out
  const toggleActive = (id) => {
    const task = taskList.find(t => t.id === id)
    if (!task) return
    moveTaskToList(id, task.list === ACTIVE ? BACKLOG : ACTIVE)
  }

  // tracking a task implies it is active — the transition runs first so a parked or
  // finished task gets its list fields cleaned up instead of just being relabelled
  const startTracking = (id) => {
    moveTaskToList(id, ACTIVE)
    beginTracking(id)
    setNewActionTime(new Date())
  }

  // options: { list, bucket } — used by Backlog to add tasks straight into 'backlog'/a bucket
  const handleAddTask = (label, time, { list = ACTIVE, bucket } = {}) => {
    if (!label?.trim()) return
    const newTask = { id: newTaskId(), label, time, list }
    if (list === BACKLOG) {
      newTask.backlog = { bucket: bucket || NEXTUP, activationDate: null }
    }
    setTaskList([...taskList, newTask])
    updateActionTime()
  }

  const handleFieldChange = (id, field, value) => {
    setTaskList(taskList.map(t => t.id === id ? { ...t, [field]: value } : t))
    updateActionTime()
  }

  const handleDeleteTask = (id) => {
    stopIfRunning(id)
    setTaskList(currentTaskList => currentTaskList.filter(t => t.id !== id))
    updateActionTime()
  }

  const deleteAllFinishedTasks = () => {
    setTaskList(taskList.filter(t => t.list !== DONE))
  }

  // manual reorder ahead of real drag & drop — moves one task to the end of the list
  const pushToBottom = (id) => {
    setTaskList(currentTaskList => {
      const task = currentTaskList.find(t => t.id === id)
      if (!task) return currentTaskList
      return [...currentTaskList.filter(t => t.id !== id), task]
    })
  }

  // dropping on finished list finishes it; reorderTasks refuses the transition
  const reorderTaskList = (activeId, overId) => {
    const activeTask = taskList.find(t => t.id === activeId)
    const overTask = taskList.find(t => t.id === overId)
    // a drop lands on a row or on a bare list, so overId is a task id or a group key
    if (!activeTask || (!overTask && !isGroupKey(overId))) return

    const wasDone = activeTask.list === DONE
    const overIsDone = overTask ? overTask.list === DONE : overId === DONE
    if (wasDone !== overIsDone) {
      if (overIsDone) return moveTaskToList(activeId, DONE)
      // un-finishing restores previousList, which can be a different list than the one
      // it was dropped on — so place it afterwards, on the state the transition wrote
      toggleDone(activeId)
      setTaskList(currentTaskList => reorderTasks(currentTaskList, activeId, overId))
      return
    }
    setTaskList(currentTaskList => reorderTasks(currentTaskList, activeId, overId))
  }

  // mid-drag: opens a gap under cursor; same-list reordering on drop; no finishing on hover
  const moveTaskAcrossLists = (activeId, overId) => {
    const activeTask = taskList.find(t => t.id === activeId)
    const overTask = taskList.find(t => t.id === overId)
    if (!activeTask || (!overTask && !isGroupKey(overId))) return
    const overGroup = overTask ? groupKey(overTask) : overId
    if (activeTask.list === DONE || overGroup === DONE) return
    if (groupKey(activeTask) === overGroup) return
    setTaskList(currentTaskList => reorderTasks(currentTaskList, activeId, overId))
  }

  const taskActions = {
    toggleDone,
    toggleActive,
    moveTaskToList,
    handleAddTask,
    onDelete: handleDeleteTask,
    handleFieldChange,
    deleteAllFinishedTasks,
    pushToBottom,
    reorderTaskList,
    moveTaskAcrossLists,
    startTracking,
    stopTracking,
    setEditingTaskId,
  }

  const finishedTasks = taskList.filter(t => t.list === DONE)
  // full backlog, ungrouped and without time estimates — Backlog page groups by .backlog.bucket itself
  const backlogTasks = taskList.filter(t => t.list === BACKLOG)

  const { openTasks, nextUpTasks } = calculateEstimates({
    taskList, startedAt, newActionTime, runningTaskId, trackedSeconds,
    // eslint-disable-next-line react-hooks/purity -- display-only, never written to state
    now: Date.now(),
  })

  return { taskList, openTasks, nextUpTasks, backlogTasks, finishedTasks, taskActions, startedAt, resetStartedAt, updateActionTime, runningTaskId, trackedSeconds, editingTaskId }
}

export default useTasks
