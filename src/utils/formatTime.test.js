import { describe, it, expect } from 'vitest'
import { formatTime, formatClockTime, formatTimeWithSeconds, effectiveMinutes } from './formatTime'

describe('formatTime', () => {
    it('formats minutes under an hour as "Xm"', () => {
        expect(formatTime(20)).toBe('20m')
    })

    it('formats whole hours with no leftover minutes as "Xh"', () => {
        expect(formatTime(60)).toBe('1h')
    })

    it('formats hours with leftover minutes as "Xh Ym"', () => {
        expect(formatTime(90)).toBe('1h 30m')
    })

    it('formats zero as "0m"', () => {
        expect(formatTime(0)).toBe('0m')
    })
})

describe('formatTimeWithSeconds', () => {
    it('zero-pads the seconds below ten', () => {
        expect(formatTimeWithSeconds(5)).toBe('0:05')
    })

    it('keeps the same "m:ss" shape under a minute', () => {
        expect(formatTimeWithSeconds(45)).toBe('0:45')
    })

    it('keeps the same shape across the minute boundary — no format flip', () => {
        expect(formatTimeWithSeconds(59)).toBe('0:59')
        expect(formatTimeWithSeconds(60)).toBe('1:00')
        expect(formatTimeWithSeconds(61)).toBe('1:01')
    })

    it('formats whole minutes with ":00", not a bare minute count', () => {
        expect(formatTimeWithSeconds(300)).toBe('5:00')
    })
})

describe('effectiveMinutes', () => {
    it('uses the tracked time once there is a full minute of it', () => {
        expect(effectiveMinutes(305, 25)).toBe(5)
    })

    it('falls back to the estimate below a full minute', () => {
        expect(effectiveMinutes(45, 25)).toBe(25)
    })

    it('treats exactly 60s as tracked — the edge case the old copies disagreed on', () => {
        expect(effectiveMinutes(60, 25)).toBe(1)
    })

    it('falls back to the estimate when trackedTime is missing on a legacy task', () => {
        expect(effectiveMinutes(undefined, 25)).toBe(25)
    })
})

describe('formatClockTime', () => {
    it('formats afternoon times as 24h "HH:mm"', () => {
        expect(formatClockTime(new Date(2026, 0, 1, 14, 5))).toBe('14:05')
    })

    it('zero-pads single-digit hours and minutes', () => {
        expect(formatClockTime(new Date(2026, 0, 1, 9, 3))).toBe('09:03')
    })

    it('formats midnight as "00:00", not "24:00" or "12:00 AM"', () => {
        expect(formatClockTime(new Date(2026, 0, 1, 0, 0))).toBe('00:00')
    })

    it('accepts an ISO string, e.g. after a localStorage round-trip', () => {
        expect(formatClockTime(new Date(2026, 0, 1, 14, 5).toISOString())).toBe('14:05')
    })
})
