import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDayActions from './useDayActions'

const seedSettings = (overrides = {}) =>
    localStorage.setItem('settings', JSON.stringify({
        rolloverHour: 4,
        defaultStartTime: '09:00',
        rolloverActive: true,
        ...overrides,
    }))

// a startedAt from the previous logical day, so the rollover check fires
const seedYesterday = () =>
    localStorage.setItem('startedAt', new Date('2026-08-07T10:00:00').toISOString())

describe('useDayActions', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.useFakeTimers()
        seedSettings()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('starts the new day at the configured time when opened before it', () => {
        vi.setSystemTime(new Date('2026-08-08T08:00:00')) // planning an hour early
        seedYesterday()

        const { result } = renderHook(() => useDayActions())

        expect(result.current.startedAt).toEqual(new Date('2026-08-08T09:00:00'))
    })

    it('starts the new day at "now" when opened after the configured time', () => {
        vi.setSystemTime(new Date('2026-08-08T11:00:00')) // slept in
        seedYesterday()

        const { result } = renderHook(() => useDayActions())

        expect(result.current.startedAt).toEqual(new Date('2026-08-08T11:00:00'))
    })

    it('honours minutes in the configured start time', () => {
        seedSettings({ defaultStartTime: '09:30' })
        vi.setSystemTime(new Date('2026-08-08T08:00:00'))
        seedYesterday()

        const { result } = renderHook(() => useDayActions())

        expect(result.current.startedAt).toEqual(new Date('2026-08-08T09:30:00'))
    })

    it('leaves startedAt alone while it is still the same logical day', () => {
        vi.setSystemTime(new Date('2026-08-08T11:00:00'))
        const earlierToday = new Date('2026-08-08T07:00:00')
        localStorage.setItem('startedAt', earlierToday.toISOString())

        const { result } = renderHook(() => useDayActions())

        expect(result.current.startedAt).toEqual(earlierToday)
    })

    it('resets to literally now, even before the configured start time', () => {
        vi.setSystemTime(new Date('2026-08-08T08:00:00'))
        const earlierToday = new Date('2026-08-08T07:00:00')
        localStorage.setItem('startedAt', earlierToday.toISOString())

        const { result } = renderHook(() => useDayActions())
        act(() => { result.current.resetStartedAt() })

        expect(result.current.startedAt).toEqual(new Date('2026-08-08T08:00:00'))
    })

    it('calls onRollover on a real day change, but not on a first-ever load', () => {
        vi.setSystemTime(new Date('2026-08-08T11:00:00'))
        const onRollover = vi.fn()

        renderHook(() => useDayActions({ onRollover })) // nothing stored yet
        expect(onRollover).not.toHaveBeenCalled()

        localStorage.clear()
        seedSettings()
        seedYesterday()
        renderHook(() => useDayActions({ onRollover }))
        expect(onRollover).toHaveBeenCalledTimes(1)
    })
})
