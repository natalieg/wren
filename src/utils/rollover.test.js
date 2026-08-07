import { describe, it, expect } from 'vitest'
import { logicalDayString } from './rollover'

describe('logicalDayString', () => {
    it('treats a time before the rollover hour as still belonging to the previous day', () => {
        const rolloverHour = 4
        const lateNight = new Date('2026-08-06T03:59:00')
        const previousAfternoon = new Date('2026-08-05T15:00:00')

        expect(logicalDayString(lateNight, rolloverHour)).toBe(logicalDayString(previousAfternoon, rolloverHour))
    })

    it('treats a time at/after the rollover hour as a fresh day', () => {
        const rolloverHour = 4
        const justAfterRollover = new Date('2026-08-06T04:00:00')
        const lateNight = new Date('2026-08-06T03:59:00')

        expect(logicalDayString(justAfterRollover, rolloverHour)).not.toBe(logicalDayString(lateNight, rolloverHour))
    })

    it('with rolloverHour 0, behaves like a plain midnight boundary', () => {
        const justBeforeMidnight = new Date('2026-08-05T23:59:00')
        const justAfterMidnight = new Date('2026-08-06T00:00:00')

        expect(logicalDayString(justBeforeMidnight, 0)).not.toBe(logicalDayString(justAfterMidnight, 0))
    })
})
