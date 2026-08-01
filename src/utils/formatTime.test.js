import { describe, it, expect } from 'vitest'
import { formatTime, formatClockTime } from './formatTime'

describe('formatTime', () => {
    it('formats minutes under an hour as "Xm"', () => {
        expect(formatTime(20)).toBe('20m')
    })

    it('formats whole hours with no leftover minutes as "Xh"', () => {
        expect(formatTime(60)).toBe('1h')
    })

    it('formats hours with leftover minutes as "XhYm"', () => {
        expect(formatTime(90)).toBe('1h30m')
    })

    it('formats zero as "0m"', () => {
        expect(formatTime(0)).toBe('0m')
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
