import { describe, it, expect } from 'vitest'
import { isLovely, finishedToday, bloomCount, otherSecondsToday, sprinkleCount, weaveLovely, canWeave, dayEndOf, splitAtDayEnd, MAX_FLOWERS } from './lovely'
import { BLOCK } from './blocks'
import { ACTIVE, DONE } from './constants'
import { logicalDayString } from './rollover'

const task = (id, time, extra = {}) => ({ id, label: `task ${id}`, time, list: ACTIVE, ...extra })
const lovely = (id, time = 5, extra = {}) => task(id, time, { lovely: true, ...extra })
const block = (id, time, extra = {}) => ({ id, kind: BLOCK, label: `block ${id}`, time, list: ACTIVE, ...extra })
const ids = (list) => list.map(t => t.id)

const NOW = new Date(2026, 9, 22, 14, 0).getTime()
const TODAY = logicalDayString(new Date(NOW), 4)

describe('isLovely', () => {
   it('needs the flag, legacy tasks and blocks are never lovely', () => {
      expect(isLovely(lovely('a'))).toBe(true)
      expect(isLovely(task('b', 5))).toBe(false)
      expect(isLovely(block('c', 60, { lovely: true }))).toBe(false)
      expect(isLovely(undefined)).toBe(false)
   })
})

describe('finishedToday', () => {
   it('keeps tasks finished after today’s rollover hour, drops older and legacy ones', () => {
      const list = [
         task('today', 5, { list: DONE, finishedTimestamp: new Date(2026, 9, 22, 9).toISOString() }),
         task('lateNight', 5, { list: DONE, finishedTimestamp: new Date(2026, 9, 22, 2).toISOString() }),
         task('legacy', 5, { list: DONE }),
      ]
      expect(ids(finishedToday(list, { now: NOW, rolloverHour: 4 }))).toEqual(['today'])
   })
})

describe('bloomCount', () => {
   it('counts finished lovely tasks only', () => {
      expect(bloomCount([lovely('a', 5, { list: DONE }), task('b', 5, { list: DONE })])).toBe(1)
   })

   it('caps at the vase size', () => {
      const many = Array.from({ length: 8 }, (_, i) => lovely(i, 5, { list: DONE }))
      expect(bloomCount(many)).toBe(MAX_FLOWERS)
   })
})

describe('otherSecondsToday', () => {
   it('sums today’s tracked time of non-lovely tasks plus the running timer', () => {
      const list = [
         task('a', 30, { trackedByDay: { [TODAY]: 1200, 'Mon Oct 19 2026': 9999 } }),
         lovely('b', 5, { trackedByDay: { [TODAY]: 600 } }),
         block('c', 60, { trackedByDay: { [TODAY]: 300 } }),
         task('d', 30),
      ]
      const seconds = otherSecondsToday(list, { runningTaskId: 'd', trackedSeconds: 120, now: NOW, rolloverHour: 4 })
      expect(seconds).toBe(1200 + 300 + 120)
   })

   it('counts a task finished today without tracking at its estimate, a finished block never', () => {
      const doneAt = new Date(2026, 9, 22, 10).toISOString()
      const list = [
         task('ticked', 20, { list: DONE, finishedTimestamp: doneAt }),
         task('tracked', 20, { list: DONE, finishedTimestamp: doneAt, trackedByDay: { [TODAY]: 45 * 60 } }),
         task('yesterday', 20, { list: DONE, finishedTimestamp: new Date(2026, 9, 21, 10).toISOString() }),
         block('b', 120, { list: DONE, finishedTimestamp: doneAt }),
         lovely('l', 30, { list: DONE, finishedTimestamp: doneAt }),
      ]
      expect(otherSecondsToday(list, { now: NOW, rolloverHour: 4 })).toBe((20 + 45) * 60)
   })

   it('ignores live seconds of a running lovely task', () => {
      expect(otherSecondsToday([lovely('a')], { runningTaskId: 'a', trackedSeconds: 500, now: NOW })).toBe(0)
   })
})

describe('sprinkleCount', () => {
   it('gives one sprinkle per full 30 minutes', () => {
      expect(sprinkleCount(29 * 60)).toBe(0)
      expect(sprinkleCount(30 * 60)).toBe(1)
      expect(sprinkleCount(95 * 60)).toBe(3)
   })
})

describe('weaveLovely', () => {
   it('puts one lovely task after each block', () => {
      const list = [block('b1', 120), block('b2', 90), task('t', 30), lovely('l1'), lovely('l2')]
      expect(ids(weaveLovely(list, { now: NOW }))).toEqual(['b1', 'l1', 'b2', 'l2', 't'])
   })

   it('puts one after ~90 minutes of loose work', () => {
      const list = [task('a', 60), task('b', 45), task('c', 20), lovely('l1')]
      expect(ids(weaveLovely(list, { now: NOW }))).toEqual(['a', 'b', 'l1', 'c'])
   })

   it('keeps leftovers at the end when the day has no more gaps', () => {
      const list = [block('b', 60), lovely('l1'), lovely('l2')]
      expect(ids(weaveLovely(list, { now: NOW }))).toEqual(['b', 'l1', 'l2'])
   })

   it('leaves running, pinned, in-block and finished lovely tasks alone', () => {
      const pinAt = new Date(2026, 9, 22, 21, 30).getTime()
      const list = [
         block('b', 60),
         lovely('inBlock', 5, { blockId: 'b' }),
         task('w', 120),
         lovely('running'),
         lovely('pinned', 20, { fixedStart: pinAt }),
         lovely('done', 5, { list: DONE }),
         lovely('free'),
      ]
      const woven = ids(weaveLovely(list, { runningTaskId: 'running', now: NOW }))
      expect(woven).toEqual(['b', 'free', 'inBlock', 'w', 'running', 'pinned', 'done'])
   })

   it('doesn’t count a lovely task’s time as work', () => {
      const list = [lovely('pinned', 120, { fixedStart: new Date(2026, 9, 22, 9).getTime() }), task('a', 30), lovely('l')]
      expect(ids(weaveLovely(list, { now: NOW }))).toEqual(['pinned', 'a', 'l'])
   })

   it('returns the same list when nothing can move', () => {
      const list = [task('a', 30), lovely('l', 5, { list: DONE })]
      expect(weaveLovely(list, { now: NOW })).toBe(list)
   })
})

describe('dayEndOf', () => {
   it('is 23:00 of the logical day, also after midnight', () => {
      expect(dayEndOf(NOW, 4)).toBe(new Date(2026, 9, 22, 23).getTime())
      expect(dayEndOf(new Date(2026, 9, 23, 1).getTime(), 4)).toBe(new Date(2026, 9, 22, 23).getTime())
   })
})

describe('splitAtDayEnd', () => {
   const at = (h, m = 0) => new Date(2026, 9, 22, h, m)
   const END = at(23).getTime()

   it('hides what would start after the day end, keeps the one running across it', () => {
      const items = [
         task('a', 60, { estimate: at(22, 30) }),
         task('b', 60, { estimate: at(23, 30) }),
         task('c', 20, { estimate: at(23, 50) }),
      ]
      const { visible, later } = splitAtDayEnd(items, END, { now: at(21, 30).getTime() })
      expect(ids(visible)).toEqual(['a', 'b'])
      expect(ids(later)).toEqual(['c'])
   })

   it('uses a pin’s own start time', () => {
      const items = [task('a', 30, { estimate: at(15) }), task('p', 20, { pinnedAt: at(23, 15), estimate: at(23, 35) })]
      expect(ids(splitAtDayEnd(items, END, { now: NOW }).later)).toEqual(['p'])
   })

   it('never hides the running item, even past the day end', () => {
      const items = [task('r', 30, { estimate: at(23, 40) }), task('x', 10, { estimate: at(23, 50) })]
      const { visible, later } = splitAtDayEnd(items, END, { now: at(23, 10).getTime(), runningTopId: 'r' })
      expect(ids(visible)).toEqual(['r'])
      expect(ids(later)).toEqual(['x'])
   })
})

describe('canWeave', () => {
   it('is false once everything already sits in a gap', () => {
      const list = [block('b', 60), lovely('l'), task('t', 30)]
      expect(canWeave(list, { now: NOW })).toBe(false)
      expect(canWeave([lovely('l'), block('b', 60)], { now: NOW })).toBe(true)
   })
})
