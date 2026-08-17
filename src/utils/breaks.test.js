import { describe, it, expect } from 'vitest'
import { breakTimeByType } from './breaks'

describe('breakTimeByType', () => {
   it('sums multiple sessions of the same type', () => {
      const breaks = [
         { type: 'tea', name: 'Tea', emoji: '🍵', trackedTime: 300 },
         { type: 'tea', name: 'Tea', emoji: '🍵', trackedTime: 120 },
      ]

      expect(breakTimeByType(breaks)).toEqual([
         { type: 'tea', name: 'Tea', emoji: '🍵', duration: 420 },
      ])
   })

   it('keeps different types separate, in first-seen order', () => {
      const breaks = [
         { type: 'walk', name: 'Walk', emoji: '🚶', trackedTime: 600 },
         { type: 'tea', name: 'Tea', emoji: '🍵', trackedTime: 300 },
      ]

      expect(breakTimeByType(breaks)).toEqual([
         { type: 'walk', name: 'Walk', emoji: '🚶', duration: 600 },
         { type: 'tea', name: 'Tea', emoji: '🍵', duration: 300 },
      ])
   })

   it('keeps the first-seen name/emoji if a type got renamed mid-day', () => {
      const breaks = [
         { type: 'tea', name: 'Tea', emoji: '🍵', trackedTime: 300 },
         { type: 'tea', name: 'Chai', emoji: '☕', trackedTime: 120 },
      ]

      expect(breakTimeByType(breaks)).toEqual([
         { type: 'tea', name: 'Tea', emoji: '🍵', duration: 420 },
      ])
   })

   it('returns an empty array for no breaks', () => {
      expect(breakTimeByType([])).toEqual([])
      expect(breakTimeByType(undefined)).toEqual([])
   })
})
