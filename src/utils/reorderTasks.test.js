import { describe, it, expect } from 'vitest'
import reorderTasks from './reorderTasks'
import { ACTIVE, BACKLOG, DONE, NEXTUP, NEXTWEEK, SOMEDAY } from './constants'

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

})

describe('reorderTasks — dropping on another list moves the task there', () => {
    it('takes the target bucket and lands at the drop position', () => {
        const taskList = [active(1), backlog(2, NEXTWEEK), backlog(3, NEXTWEEK)]
        const result = reorderTasks(taskList, 1, 3)

        expect(ids(result)).toEqual([2, 1, 3])
        expect(result[1]).toMatchObject({ id: 1, list: BACKLOG })
        expect(result[1].backlog.bucket).toBe(NEXTWEEK)
    })

    it('moves between buckets', () => {
        const taskList = [backlog(1), backlog(2, SOMEDAY)]
        const result = reorderTasks(taskList, 1, 2)

        expect(result[0].backlog.bucket).toBe(SOMEDAY)
        expect(ids(result)).toEqual([1, 2])
    })

    it('clears the backlog object when the target is the active list', () => {
        const taskList = [active(1), backlog(2, SOMEDAY)]
        const result = reorderTasks(taskList, 2, 1)

        expect(result[0]).toMatchObject({ id: 2, list: ACTIVE })
        expect(result[0].backlog).toBeUndefined()
    })

    // the date belongs to the task, not to the bucket it happens to sit in
    it('keeps activationDate across a bucket change', () => {
        const dated = { ...backlog(1), backlog: { bucket: NEXTUP, activationDate: '2026-08-20' } }
        const result = reorderTasks([dated, backlog(2, SOMEDAY)], 1, 2)

        expect(result[0].backlog).toEqual({ bucket: SOMEDAY, activationDate: '2026-08-20' })
    })

    it('leaves tasks of uninvolved lists alone', () => {
        const taskList = [active(1), active(2), backlog(3, SOMEDAY)]
        const result = reorderTasks(taskList, 1, 3)

        expect(ids(result)).toEqual([2, 1, 3])
        expect(result[0]).toBe(taskList[1])
    })
})

// an empty or collapsed list has no row to drop on, so the list itself is a target
describe('reorderTasks — dropping on a list instead of a row', () => {
    it('moves a task into an empty list', () => {
        const taskList = [backlog(1), backlog(2)]
        const result = reorderTasks(taskList, 1, ACTIVE)

        expect(result[1]).toMatchObject({ id: 1, list: ACTIVE })
        expect(result[1].backlog).toBeUndefined()
    })

    it('appends to the end of a list that already has tasks', () => {
        const taskList = [active(1), active(2), backlog(3, SOMEDAY)]
        const result = reorderTasks(taskList, 3, ACTIVE)

        expect(ids(result)).toEqual([1, 2, 3])
        expect(result[2]).toMatchObject({ id: 3, list: ACTIVE })
    })

    it('moves into a bucket by its group key', () => {
        const taskList = [active(1), backlog(2, NEXTWEEK)]
        const result = reorderTasks(taskList, 1, `${BACKLOG}:${SOMEDAY}`)

        expect(result[1].backlog.bucket).toBe(SOMEDAY)
    })

    it('reads a drop on its own list as "move to the end"', () => {
        const taskList = [active(1), active(2), active(3)]
        expect(ids(reorderTasks(taskList, 1, ACTIVE))).toEqual([2, 3, 1])
    })

    it('ignores an overId that is neither a task nor a list', () => {
        const taskList = [active(1), active(2)]
        expect(reorderTasks(taskList, 1, 'not-a-group')).toBe(taskList)
    })
})

describe('reorderTasks — done is not a drag transition', () => {
    // finishing writes a timestamp and a history entry, so toggleDone owns it and
    // a drop onto the finished list is routed there instead of moving the task here
    it('refuses a drop onto a finished task', () => {
        const taskList = [active(1), { ...active(2), list: DONE }]
        expect(reorderTasks(taskList, 1, 2)).toBe(taskList)
    })

    it('refuses dragging a finished task somewhere else', () => {
        const taskList = [{ ...active(1), list: DONE }, active(2)]
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
