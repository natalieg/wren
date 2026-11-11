import { describe, it, expect } from 'vitest'
import { activeBufferMinutes, stepBuffer, breatherEndsAt, BUFFER_MAX } from './buffer'

const MINUTE = 60 * 1000

describe('activeBufferMinutes', () => {
   it('is 0 while the setting is off', () => {
      expect(activeBufferMinutes({ bufferEnabled: false, bufferMinutes: 5 })).toBe(0)
   })
   it('uses the minutes while on, guarding junk values', () => {
      expect(activeBufferMinutes({ bufferEnabled: true, bufferMinutes: 10 })).toBe(10)
      expect(activeBufferMinutes({ bufferEnabled: true, bufferMinutes: undefined })).toBe(0)
      expect(activeBufferMinutes({ bufferEnabled: true, bufferMinutes: -5 })).toBe(0)
   })
})

describe('stepBuffer', () => {
   it('steps by 5 and clamps between 0 and the max', () => {
      expect(stepBuffer(5, 1)).toBe(10)
      expect(stepBuffer(5, -1)).toBe(0)
      expect(stepBuffer(0, -1)).toBe(0)
      expect(stepBuffer(BUFFER_MAX, 1)).toBe(BUFFER_MAX)
   })
})

describe('breatherEndsAt', () => {
   const at = (iso) => ({ finishedTimestamp: iso })

   it('ends buffer minutes after the latest finish', () => {
      const end = breatherEndsAt([at('2026-11-11T10:00:00Z'), at('2026-11-11T10:30:00Z')], 5)
      expect(end).toBe(new Date('2026-11-11T10:30:00Z').getTime() + 5 * MINUTE)
   })
   it('is null without a buffer or without finished tasks', () => {
      expect(breatherEndsAt([at('2026-11-11T10:00:00Z')], 0)).toBeNull()
      expect(breatherEndsAt([], 5)).toBeNull()
   })
   it('ignores legacy tasks without a finish time', () => {
      expect(breatherEndsAt([at(null), at(undefined)], 5)).toBeNull()
   })
})
