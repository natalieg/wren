import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

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
