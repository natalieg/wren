import { useState, useEffect, useCallback } from 'react'
import useHistoryContext from './useHistoryContext'
import useTimeTracking from './useTimeTracking'
import useTaskRollover from './useTaskRollover'
import { DONE, ACTIVE, BACKLOG, NEXTUP } from '../utils/constants'
import reorderTasks, { groupKey, isGroupKey } from '../utils/reorderTasks'
import { applyListChange, entersAtEnd } from '../utils/taskTransitions'
import calculateEstimates from '../utils/taskEstimates'
import { newTaskId } from '../utils/taskId'
import { reviveOrphanedHabits } from '../utils/recurring'
import { getNextCopyTitle, getPrevCopyIndex, getOpenCopies } from './useTaskCopy'
import useTimeAlert from './useTimeAlert'
import { playFinishedSound } from '../utils/playSound'
import { loadSettings } from '../utils/settings'
import { addTrackedToday } from '../utils/trackedByDay'
import { BLOCK, isBlock, activeBlockIds, releaseOpenMembers, adoptIntoBlock } from '../utils/blocks'

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
   const { addToHistory, removeFromHistory } = useHistoryContext()
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
   useTimeAlert(taskList, runningTaskId, trackedSeconds)


   useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(taskList))
   }, [taskList])

   // moves a task to a different list, applying the transition and cleaning up
   const moveTaskToList = (id, target, opts = {}) => {
      const task = taskList.find(t => t.id === id)
      if (!task || task.list === target) return
      // a block lives on the day list only, it never parks
      if (isBlock(task) && target === BACKLOG) return
      let next = applyListChange(task, target, opts)
      // un-finishing into a block that's gone makes it a plain task again
      if (next.blockId && !isBlock(next) && !activeBlockIds(taskList).has(next.blockId)) {
         next = { ...next, blockId: undefined }
      }

      if (task.list === DONE) removeFromHistory(id)
      // the entry misses seconds still sitting in the running timer — the flush below
      // can only land on the next render. Known, pre-dates the transition rewrite
      if (target === DONE) {
         // a block's history entry is only its general time, never its planned duration
         if (!isBlock(next)) addToHistory(next)
         else if ((next.trackedTime || 0) >= 60) addToHistory({ ...next, time: 0 })
         playFinishedSound()
      }

      setTaskList(currentTaskList => {
         const moved = entersAtEnd(target)
            ? [...currentTaskList.filter(t => t.id !== id), next]
            : currentTaskList.map(t => t.id === id ? next : t)
         // a finished block lets its open tasks go back onto the day list
         return isBlock(task) && target === DONE ? releaseOpenMembers(moved, id) : moved
      })

      // after setTaskList on purpose: the flush is a functional update and has to land
      // on top of the transition instead of being overwritten by it
      stopIfRunning(id)
   }

   // eslint-disable-next-line react-hooks/exhaustive-deps
   const updateActionTime = useCallback(() => {
      if (!taskList.some(t => t.list === ACTIVE)) {
         setNewActionTime(new Date())
      }
   })

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

   // enabling brings the whole open family into synch (flag + this task's current notes);
   // disabling only clears the flag, existing notes are left alone
   const toggleNoteSynch = (id) => {
      setTaskList(prev => {
         const task = prev.find(t => t.id === id)
         if (!task) return prev
         const synchingOn = !task.noteSynch
         const familyIds = new Set([id, ...getOpenCopies(task.label, prev).map(c => c.id)])
         return prev.map(t => familyIds.has(t.id)
            ? { ...t, noteSynch: synchingOn, notes: synchingOn ? task.notes : t.notes }
            : t)
      })
   }


   // starts tracking a task, moving it to active if it was parked
   const startTracking = (id) => {
      moveTaskToList(id, ACTIVE)
      beginTracking(id)
      setNewActionTime(new Date())
   }

   // options: { list, bucket } — used by Backlog to add tasks straight into 'backlog'/a bucket; atTop puts it first
   const handleAddTask = (label, time, { list = ACTIVE, bucket, project, blockId, atTop = false } = {}) => {
      if (!label?.trim()) return
      const newTask = { id: newTaskId(), label, time, list }
      if (list === BACKLOG) {
         newTask.backlog = { bucket: bucket || NEXTUP, activationDate: null }
      }
      if (project) newTask.project = project
      if (blockId && list === ACTIVE) newTask.blockId = blockId
      setTaskList(atTop ? [newTask, ...taskList] : [...taskList, newTask])
      updateActionTime()
   }

   // a time block, for a project or a free topic; a project's loose day tasks move in right away
   const handleAddBlock = (project, label, time, { atTop = false } = {}) => {
      if (!label?.trim() || !(time > 0)) return
      const block = { id: newTaskId(), kind: BLOCK, label, time, list: ACTIVE }
      if (project) block.project = project
      setTaskList(prev => {
         const adopted = adoptIntoBlock(prev, block, { fromNextUp: false })
         return atTop ? [block, ...adopted] : [...adopted, block]
      })
      updateActionTime()
   }

   // pulls the project's loose day tasks and its next-up tasks into the block
   const fillBlock = (blockId) => {
      setTaskList(prev => {
         const block = prev.find(t => t.id === blockId)
         return block ? adoptIntoBlock(prev, block, { fromNextUp: true }) : prev
      })
   }

   const handleCopyTask = useCallback((id) => {
      const sourceTask = taskList.find(t => t.id === id)
      if (!sourceTask) return
      const copy = {
         ...sourceTask,
         label: getNextCopyTitle(sourceTask.label, taskList),
         id: newTaskId(),
         trackedTime: 0,
         trackedByDay: undefined,
         finishedTimestamp: undefined,
         runningTaskId: undefined,
      }
      const copyIndex = getPrevCopyIndex(sourceTask.label, taskList)
      setTaskList(prev => {
         const next = [...prev]
         next.splice(copyIndex + 1, 0, copy) // insert below the last copy of the same base name
         return next
      })
      updateActionTime()
   }, [taskList, updateActionTime])

   const handleFieldChange = (id, field, value) => {
      const { rolloverHour } = loadSettings()
      // a hand-edited trackedTime books the difference on today, so weekly numbers stay in sync
      const change = (t) => field === 'trackedTime'
         ? addTrackedToday({ ...t, trackedTime: value }, value - (t.trackedTime || 0), Date.now(), rolloverHour)
         : { ...t, [field]: value }
      setTaskList(prev => {
         const next = prev.map(t => t.id === id ? change(t) : t)
         if (field !== 'notes' || value.length === 0) return next
         // handle note synch
         const task = next.find(t => t.id === id)
         if (!task.noteSynch) return next
         const copyIds = new Set(getOpenCopies(task.label, next).map(c => c.id))
         return next.map(t => copyIds.has(t.id) ? { ...t, notes: value } : t)
      })
      updateActionTime()
   }

   // stops tracking and deletes the task, reviving any orphaned habits if it was a recurring task
   const handleDeleteTask = (id) => {
      stopIfRunning(id)
      setTaskList(currentTaskList => {
         const task = currentTaskList.find(t => t.id === id)
         const kept = currentTaskList.filter(t => t.id !== id)
         if (!task) return currentTaskList
         // deleting a block keeps its tasks, they just lose the block
         if (isBlock(task)) return kept.map(t => t.blockId === id ? { ...t, blockId: undefined } : t)
         return [...kept, ...reviveOrphanedHabits(kept, [task], { list: BACKLOG, bucket: NEXTUP })]
      })
      updateActionTime()
   }

   const deleteAllFinishedTasks = () => {
      setTaskList(currentTaskList => {
         const kept = currentTaskList.filter(t => t.list !== DONE)
         const removed = currentTaskList.filter(t => t.list === DONE)
         return [...kept, ...reviveOrphanedHabits(kept, removed, { list: BACKLOG, bucket: NEXTUP })]
      })
   }

   // project deleted, user chose "delete tasks too" — habits still get revived, same rule as any other delete
   const deleteProjectTasks = (projectId) => {
      setTaskList(currentTaskList => {
         const kept = currentTaskList.filter(t => t.project !== projectId)
         const removed = currentTaskList.filter(t => t.project === projectId)
         return [...kept, ...reviveOrphanedHabits(kept, removed, { list: BACKLOG, bucket: NEXTUP })]
      })
   }

   // project deleted, user chose "keep tasks without project" — tasks stay exactly where they are, just unlinked
   const unassignProjectTasks = (projectId) => {
      setTaskList(currentTaskList =>
         currentTaskList.map(t => t.project === projectId ? { ...t, project: undefined } : t)
      )
   }

   const moveAllTasksToNextUp = () => {
      //move all active tasks except if a task is currently running; blocks stay on the day
      setTaskList(currentTaskList =>
         currentTaskList.map(t => t.list === ACTIVE && t.id !== runningTaskId && !isBlock(t) ? applyListChange(t, BACKLOG, { bucket: NEXTUP }) : t)
      )
      updateActionTime()
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
      toggleNoteSynch,
      moveTaskToList,
      handleAddTask,
      handleAddBlock,
      fillBlock,
      handleCopyTask,
      onDelete: handleDeleteTask,
      handleFieldChange,
      moveAllTasksToNextUp,
      deleteAllFinishedTasks,
      deleteProjectTasks,
      unassignProjectTasks,
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

   return {
      taskList, openTasks, nextUpTasks, backlogTasks, finishedTasks, taskActions,
      startedAt, resetStartedAt, updateActionTime, setNewActionTime, runningTaskId, trackedSeconds, editingTaskId,
   }
}

export default useTasks
