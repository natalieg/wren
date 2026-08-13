import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useBreakTracking from './useBreakTracking'

// The banking half of break tracking: what a stopped session leaves behind.
// The "only one runs at a time" rule is not here — see utils/activityTracking.
describe('useBreakTracking', () => {
   const pauseType = { id: 'break', name: 'break', emoji: '🍵' }
   const gamingType = { id: 'gaming', name: 'gaming', emoji: '🎮' }

   beforeEach(() => {
      localStorage.clear()
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
   })

   const setup = () => {
      const onBreakFinished = vi.fn()
      const { result } = renderHook(() => useBreakTracking({ onBreakFinished }))
      return { result, onBreakFinished }
   }

   it('banks the elapsed seconds onto the type it was tracking', () => {
      const { result } = setup()

      act(() => { result.current.startBreak(pauseType) })
      act(() => { vi.advanceTimersByTime(7000) })
      act(() => { result.current.stopBreak() })

      expect(result.current.runningBreakId).toBe(null)
      expect(result.current.breakDurations.break).toBe(7)
   })

   it('hands the finished session to onBreakFinished, with the type snapshotted', () => {
      const { result, onBreakFinished } = setup()

      act(() => { result.current.startBreak(gamingType) })
      act(() => { vi.advanceTimersByTime(5000) })
      act(() => { result.current.stopBreak() })

      expect(onBreakFinished).toHaveBeenCalledTimes(1)
      expect(onBreakFinished.mock.calls[0][0]).toMatchObject({
         type: 'gaming',
         name: 'gaming',
         emoji: '🎮',
         trackedTime: 5,
      })
   })

   it('keeps a separate running total per type across sessions', () => {
      const { result } = setup()

      act(() => { result.current.startBreak(pauseType) })
      act(() => { vi.advanceTimersByTime(4000) })
      act(() => { result.current.stopBreak() })

      act(() => { result.current.startBreak(gamingType) })
      act(() => { vi.advanceTimersByTime(6000) })
      act(() => { result.current.stopBreak() })

      act(() => { result.current.startBreak(pauseType) })
      act(() => { vi.advanceTimersByTime(2000) })
      act(() => { result.current.stopBreak() })

      expect(result.current.breakDurations).toEqual({ break: 6, gaming: 6 })
   })

   it('logs nothing for a session that was stopped before a full second passed', () => {
      const { result, onBreakFinished } = setup()

      act(() => { result.current.startBreak(pauseType) })
      act(() => { result.current.stopBreak() })

      expect(onBreakFinished).not.toHaveBeenCalled()
   })

   it('drops durations saved for an earlier logical day', () => {
      localStorage.setItem('breakDurations', JSON.stringify({
         day: 'Mon Jan 01 2001',
         durations: { break: 3600 },
      }))

      const { result } = setup()

      expect(result.current.breakDurations).toEqual({})
   })
})
