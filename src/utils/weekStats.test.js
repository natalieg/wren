import { describe, it, expect } from 'vitest'
import { groupHistoryByWeek, computeWeekStats } from './weekStats'

// Mon 2026-08-10 .. Sun 2026-08-16, and the following Mon 2026-08-17
const mon = new Date(2026, 7, 10)
const wed = new Date(2026, 7, 12)
const nextMon = new Date(2026, 7, 17)

describe('groupHistoryByWeek', () => {
   it('buckets entries from the same week together, newest week first', () => {
      const history = [
         { date: nextMon.toDateString(), tasks: [] },
         { date: wed.toDateString(), tasks: [] },
         { date: mon.toDateString(), tasks: [] },
      ]

      const weeks = groupHistoryByWeek(history)

      expect(weeks).toHaveLength(2)
      expect(weeks[0].weekStart.toDateString()).toBe(nextMon.toDateString())
      expect(weeks[0].entries).toEqual([history[0]])
      expect(weeks[1].weekStart.toDateString()).toBe(mon.toDateString())
      expect(weeks[1].entries).toEqual([history[1], history[2]])
   })

   it('returns an empty array for no history', () => {
      expect(groupHistoryByWeek([])).toEqual([])
   })
})

describe('computeWeekStats', () => {
   it('fills all 7 days, zeroing days with no entry', () => {
      const entries = [
         { date: wed.toDateString(), tasks: [{ id: 1, trackedTime: 1800, time: 20 }], breaks: [{ trackedTime: 300 }] },
      ]

      const stats = computeWeekStats(mon, entries)

      expect(stats.days).toHaveLength(7)
      expect(stats.days.map(d => d.label)).toEqual(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'])
      const wednesday = stats.days[2]
      expect(wednesday.focusedMinutes).toBe(30)
      expect(wednesday.breakMinutes).toBe(5)
      expect(wednesday.taskCount).toBe(1)
      expect(stats.days[0]).toMatchObject({ focusedMinutes: 0, breakMinutes: 0, taskCount: 0 })
   })

   it('sums totals and formats the break:focus ratio', () => {
      const entries = [
         { date: mon.toDateString(), tasks: [{ id: 1, trackedTime: 3600, time: 60 }], breaks: [{ trackedTime: 1800 }] },
      ]

      const stats = computeWeekStats(mon, entries)

      expect(stats.totalFocusedMinutes).toBe(60)
      expect(stats.totalBreakMinutes).toBe(30)
      expect(stats.ratioText).toBe('1:2.0')
   })

   it('falls back when there is no break time logged', () => {
      const withFocus = computeWeekStats(mon, [{ date: mon.toDateString(), tasks: [{ id: 1, trackedTime: 0, time: 25 }] }])
      expect(withFocus.ratioText).toBe('1:∞')

      const empty = computeWeekStats(mon, [])
      expect(empty.ratioText).toBe('–:–')
   })
})
