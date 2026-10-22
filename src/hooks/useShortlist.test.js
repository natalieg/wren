import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useShortlist, { SHORTLIST_STORAGE_KEY } from './useShortlist'

describe('useShortlist', () => {
   beforeEach(() => localStorage.clear())

   it('adds trimmed items and persists them', () => {
      const { result } = renderHook(() => useShortlist())
      act(() => result.current.addToShortlist('  water the plants '))

      expect(result.current.shortlist.map(i => i.label)).toEqual(['water the plants'])
      expect(JSON.parse(localStorage.getItem(SHORTLIST_STORAGE_KEY))).toHaveLength(1)
   })

   it('ignores empty input', () => {
      const { result } = renderHook(() => useShortlist())
      act(() => result.current.addToShortlist('   '))
      expect(result.current.shortlist).toEqual([])
   })

   it('removes an item and survives a reload', () => {
      const first = renderHook(() => useShortlist())
      act(() => {
         first.result.current.addToShortlist('a')
         first.result.current.addToShortlist('b')
      })
      act(() => first.result.current.removeFromShortlist(first.result.current.shortlist[0].id))

      const reloaded = renderHook(() => useShortlist())
      expect(reloaded.result.current.shortlist.map(i => i.label)).toEqual(['b'])
   })
})
