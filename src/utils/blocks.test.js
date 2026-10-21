import { describe, it, expect } from 'vitest'
import { blockStats, minutesLeft, minutesDone, adoptIntoBlock, releaseOpenMembers, fillCandidates, blockIdOf, activeBlockIds, waitsForBlock, BLOCK } from './blocks'
import { ACTIVE, BACKLOG, DONE, NEXTUP, SOMEDAY } from './constants'

const block = (id, time, extra = {}) => ({ id, kind: BLOCK, label: 'Solverint', project: 'p1', time, list: ACTIVE, ...extra })
const task = (id, time, extra = {}) => ({ id, label: `task ${id}`, time, list: ACTIVE, ...extra })
const idle = { runningTaskId: null, trackedSeconds: 0 }

describe('waitsForBlock', () => {
   const blocksOnly = new Set(['p1'])
   const list = [
      block('b', 60),
      task(1, 20, { project: 'p1' }),
      task(2, 20, { project: 'p1', blockId: 'b' }),
      task(3, 20, { project: 'p2' }),
      task(4, 20, { project: 'p1', list: BACKLOG }),
      task(5, 20, { project: 'p1', blockId: 'gone' }),
   ]
   const waiting = () => list.filter(t => waitsForBlock(t, activeBlockIds(list), blocksOnly)).map(t => t.id)

   it('only a loose day task of a blocks-only project waits, a stale blockId counts as loose', () => {
      expect(waiting()).toEqual([1, 5])
   })
})

describe('blockStats', () => {
   it('sums planned and tracked time over all members, finished ones too', () => {
      const list = [
         block('b', 240, { trackedTime: 15 * 60 }),
         task(1, 90, { blockId: 'b', list: DONE, trackedTime: 80 * 60 }),
         task(2, 30, { blockId: 'b', trackedTime: 10 * 60 }),
         task(3, 45),
      ]
      const stats = blockStats(list[0], list, idle)
      expect(stats.plannedMinutes).toBe(120)
      expect(stats.trackedSeconds).toBe((15 + 80 + 10) * 60)
      expect(stats.generalSeconds).toBe(15 * 60)
   })

   it('counts a member finished without tracking by its estimate', () => {
      const list = [block('b', 60), task(1, 20, { blockId: 'b', list: DONE }), task(2, 20, { blockId: 'b', list: DONE, trackedTime: 30 })]
      expect(blockStats(list[0], list, idle).trackedSeconds).toBe(40 * 60)
   })

   it('counts the running timer of a member and marks the block busy', () => {
      const list = [block('b', 60), task(1, 30, { blockId: 'b' })]
      const stats = blockStats(list[0], list, { runningTaskId: 1, trackedSeconds: 120 })
      expect(stats.trackedSeconds).toBe(120)
      expect(stats.isBusy).toBe(true)
   })

   it.each([
      [229, 'buffer'],
      [230, 'full'],   // 10m under still counts as full
      [250, 'full'],
      [251, 'over'],
   ])('planned %i of 240 is %s', (planned, state) => {
      const list = [block('b', 240), task(1, planned, { blockId: 'b' })]
      expect(blockStats(list[0], list, idle).state).toBe(state)
   })

   it('general time fills the buffer', () => {
      const list = [block('b', 180, { trackedTime: 60 * 60 }), task(1, 120, { blockId: 'b', list: DONE, trackedTime: 120 * 60 })]
      expect(blockStats(list[0], list, idle)).toMatchObject({ usedMinutes: 180, state: 'full' })
   })

   it('a task tracked past its estimate counts with its tracked time, done or still open', () => {
      const list = [
         block('b', 120),
         task(1, 30, { blockId: 'b', list: DONE, trackedTime: 60 * 60 }),
         task(2, 30, { blockId: 'b', trackedTime: 50 * 60 }),
      ]
      expect(blockStats(list[0], list, idle)).toMatchObject({ plannedMinutes: 60, usedMinutes: 110, state: 'full' })
   })

   it('a task tracked under its estimate still holds its full estimate', () => {
      const list = [block('b', 120), task(1, 60, { blockId: 'b', trackedTime: 10 * 60 })]
      expect(blockStats(list[0], list, idle)).toMatchObject({ usedMinutes: 60, state: 'buffer' })
   })
})

describe('block membership', () => {
   it('treats a blockId of a finished or missing block as a plain task', () => {
      const list = [block('b', 60, { list: DONE }), task(1, 10, { blockId: 'b' }), task(2, 10, { blockId: 'gone' })]
      const ids = activeBlockIds(list)
      expect(blockIdOf(list[1], ids)).toBeNull()
      expect(blockIdOf(list[2], ids)).toBeNull()
   })
})

describe('minutesLeft / minutesDone', () => {
   it('reserves the full duration for a block that is not filled', () => {
      const open = [block('b', 240), task(1, 60, { blockId: 'b' }), task(2, 20)]
      expect(minutesLeft(open, [])).toBe(240 + 20)
   })

   it('lets the tasks win when they need more than the block', () => {
      const open = [block('b', 60), task(1, 50, { blockId: 'b' }), task(2, 40, { blockId: 'b' })]
      expect(minutesLeft(open, [])).toBe(90)
   })

   it('shrinks the reservation by finished members and general time', () => {
      const open = [block('b', 240, { trackedTime: 30 * 60 }), task(2, 20, { blockId: 'b' })]
      const finished = [task(1, 60, { blockId: 'b', list: DONE, trackedTime: 70 * 60 })]
      expect(minutesLeft(open, finished)).toBe(240 - 70 - 30)
   })

   it('counts a finished block by its general time only', () => {
      const finished = [block('b', 240, { list: DONE, trackedTime: 0 }), block('c', 120, { list: DONE, trackedTime: 25 * 60 }), task(1, 20, { list: DONE })]
      expect(minutesDone(finished)).toBe(25 + 20)
   })
})

describe('adoptIntoBlock / releaseOpenMembers', () => {
   const nextUp = (id, project) => ({ ...task(id, 10, { project }), list: BACKLOG, backlog: { bucket: NEXTUP, activationDate: null } })

   it('takes loose day tasks of the project, leaves other projects and other blocks alone', () => {
      const b = block('b', 120)
      const list = [b, task(1, 10, { project: 'p1' }), task(2, 10, { project: 'p2' }),
         block('c', 60), task(3, 10, { project: 'p1', blockId: 'c' }), nextUp(4, 'p1')]
      const result = adoptIntoBlock(list, b, { fromNextUp: false })
      expect(result.map(t => t.blockId)).toEqual([undefined, 'b', undefined, undefined, 'c', undefined])
   })

   it('pulls next-up tasks onto the day when filling, but not other buckets', () => {
      const b = block('b', 120)
      const someday = { ...nextUp(5, 'p1'), backlog: { bucket: SOMEDAY, activationDate: null } }
      const result = adoptIntoBlock([b, nextUp(4, 'p1'), someday], b, { fromNextUp: true })
      expect(result[1]).toMatchObject({ list: ACTIVE, blockId: 'b', backlog: undefined })
      expect(result[2]).toBe(someday)
   })

   it('has nothing to fill for a topic block without project', () => {
      const topic = block('t', 60, { project: undefined })
      expect(fillCandidates([topic, task(1, 10), task(2, 10, { project: 'p1' })], topic, { fromNextUp: true })).toEqual([])
   })

   it('releases only the open members of a finished block', () => {
      const list = [task(1, 10, { blockId: 'b' }), task(2, 10, { blockId: 'b', list: DONE })]
      const result = releaseOpenMembers(list, 'b')
      expect(result[0].blockId).toBeUndefined()
      expect(result[1].blockId).toBe('b')
   })
})
