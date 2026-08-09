import { describe, it, expect } from 'vitest'
import reorderTasks from './reorderTasks'
import { ACTIVE, BACKLOG, DONE, NEXTUP, NEXTWEEK } from './constants'

const active = (id) => ({ id, label: `task ${id}`, time: 10, list: ACTIVE })
const backlog = (id, bucket = NEXTUP) => ({
    id, label: `task ${id}`, time: 10, list: BACKLOG,
    backlog: { bucket, activationDate: null }
})
const ids = (list) => list.map(t => t.id)

describe('reorderTasks — moving within one list', () => {
    it('moves a task down, landing it after the task it was dropped on', () => {
        const taskList = [active(1), active(2), active(3)]
        expect(ids(reorderTasks(taskList, 1, 3))).toEqual([2, 3, 1])
    })

    it('moves a task up, landing it before the task it was dropped on', () => {
        const taskList = [active(1), active(2), active(3)]
        expect(ids(reorderTasks(taskList, 3, 1))).toEqual([3, 1, 2])
    })

    it('swaps neighbours', () => {
        const taskList = [active(1), active(2), active(3)]
        expect(ids(reorderTasks(taskList, 2, 1))).toEqual([2, 1, 3])
    })
})

describe('reorderTasks — leaving everything else alone', () => {
    // the whole reason this works on slots instead of filter+concat: a backlog task
    // sitting between two active ones must not be dragged along by an active reorder
    it('keeps tasks of other lists at their exact index', () => {
        const taskList = [active(1), backlog(2), active(3)]
        const result = reorderTasks(taskList, 1, 3)

        expect(ids(result)).toEqual([3, 2, 1])
        expect(result[1]).toBe(taskList[1])
    })

    it('treats each backlog bucket as its own list', () => {
        const taskList = [backlog(1), backlog(2, NEXTWEEK), backlog(3)]
        const result = reorderTasks(taskList, 1, 3)

        expect(ids(result)).toEqual([3, 2, 1])
    })

    it('does not reorder across buckets — that is a move, not a reorder', () => {
        const taskList = [backlog(1), backlog(2, NEXTWEEK)]
        expect(reorderTasks(taskList, 1, 2)).toBe(taskList)
    })

    it('does not reorder across lists', () => {
        const taskList = [active(1), backlog(2)]
        expect(reorderTasks(taskList, 1, 2)).toBe(taskList)
    })
})

describe('reorderTasks — no-ops return the same array reference', () => {
    // returning the identical reference is deliberate: setTaskList gets the array it
    // already holds, React bails out, no re-render and no localStorage write
    it('does nothing when a task is dropped on itself', () => {
        const taskList = [active(1), active(2)]
        expect(reorderTasks(taskList, 1, 1)).toBe(taskList)
    })

    it('does nothing when an id is unknown', () => {
        const taskList = [active(1), active(2)]
        expect(reorderTasks(taskList, 1, 99)).toBe(taskList)
        expect(reorderTasks(taskList, 99, 1)).toBe(taskList)
    })

    it('does nothing when an id is missing entirely (over can be null on a bad drop)', () => {
        const taskList = [active(1), active(2)]
        expect(reorderTasks(taskList, 1, null)).toBe(taskList)
        expect(reorderTasks(taskList, undefined, 1)).toBe(taskList)
    })
})

describe('reorderTasks — legacy data', () => {
    // deployed localStorage predates the bucket field; useTasks reads those as nextUp,
    // so groupKey has to agree or the task renders in a list it cannot be dropped into
    it('groups a backlog task with no bucket together with nextUp', () => {
        const legacy = { id: 2, label: 'legacy', time: 10, list: BACKLOG }
        const taskList = [backlog(1), legacy, backlog(3)]

        expect(ids(reorderTasks(taskList, 1, 2))).toEqual([2, 1, 3])
    })
})

describe('reorderTasks — does not mutate its input', () => {
    it('leaves the array it was handed untouched', () => {
        const taskList = [active(1), active(2), active(3)]
        reorderTasks(taskList, 1, 3)

        expect(ids(taskList)).toEqual([1, 2, 3])
    })

    it('keeps done tasks in their own group', () => {
        const taskList = [{ ...active(1), list: DONE }, active(2)]
        expect(reorderTasks(taskList, 1, 2)).toBe(taskList)
    })
})
