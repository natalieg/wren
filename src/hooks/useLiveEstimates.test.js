import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useLiveEstimates, { LIVE_REFRESH_MS } from './useLiveEstimates'

describe('useLiveEstimates', () => {
   beforeEach(() => vi.useFakeTimers())
   afterEach(() => vi.useRealTimers())

   const setVisibility = (state) => {
      Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
   }

   it('does nothing while disabled', () => {
      const setAnchor = vi.fn()
      renderHook(() => useLiveEstimates(false, setAnchor))
      vi.advanceTimersByTime(LIVE_REFRESH_MS * 3)
      setVisibility('visible')
      expect(setAnchor).not.toHaveBeenCalled()
   })

   it('moves the anchor to now right away and every 5 min', () => {
      const setAnchor = vi.fn()
      renderHook(() => useLiveEstimates(true, setAnchor))
      expect(setAnchor).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(LIVE_REFRESH_MS * 2)
      expect(setAnchor).toHaveBeenCalledTimes(3)
      expect(setAnchor.mock.calls[2][0].getTime()).toBe(Date.now())
   })

   it('refreshes when the tab becomes visible again, not when hidden', () => {
      const setAnchor = vi.fn()
      renderHook(() => useLiveEstimates(true, setAnchor))
      setAnchor.mockClear()
      setVisibility('hidden')
      expect(setAnchor).not.toHaveBeenCalled()
      setVisibility('visible')
      expect(setAnchor).toHaveBeenCalledTimes(1)
   })

   it('stops once disabled (e.g. a task starts running)', () => {
      const setAnchor = vi.fn()
      const { rerender } = renderHook(({ on }) => useLiveEstimates(on, setAnchor), { initialProps: { on: true } })
      rerender({ on: false })
      setAnchor.mockClear()
      vi.advanceTimersByTime(LIVE_REFRESH_MS * 2)
      setVisibility('visible')
      expect(setAnchor).not.toHaveBeenCalled()
   })
})
