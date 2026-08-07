import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useHistory from './useHistory'

const finishedTask = (id, label, finishedTimestamp) => ({ id, label, finishedTimestamp })

describe('useHistory', () => {
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem('settings', JSON.stringify({ rolloverHour: 4, rolloverActive: true }))
    })

    it('files a task finished during the day under that same day', () => {
        const { result } = renderHook(() => useHistory())

        act(() => {
            result.current.addToHistory(finishedTask(1, 'Afternoon task', new Date('2026-08-07T14:00:00')))
        })

        expect(result.current.history).toHaveLength(1)
        expect(result.current.history[0].date).toBe(new Date('2026-08-07T14:00:00').toDateString())
    })

    it('files a task finished before the rollover hour under the previous day', () => {
        const { result } = renderHook(() => useHistory())

        act(() => {
            result.current.addToHistory(finishedTask(1, 'Late night task', new Date('2026-08-08T02:00:00')))
        })

        // 2am with rolloverHour 4 still belongs to Aug 7's working day, not Aug 8
        expect(result.current.history[0].date).toBe(new Date('2026-08-07T12:00:00').toDateString())
    })

    it('groups tasks from either side of midnight into one logical day', () => {
        const { result } = renderHook(() => useHistory())

        act(() => {
            result.current.addToHistory(finishedTask(1, 'Before midnight', new Date('2026-08-07T23:00:00')))
        })
        act(() => {
            result.current.addToHistory(finishedTask(2, 'After midnight', new Date('2026-08-08T02:00:00')))
        })

        expect(result.current.history).toHaveLength(1)
        expect(result.current.history[0].tasks.map(t => t.id)).toEqual([1, 2])
    })

    it('starts a new day entry once the rollover hour has passed', () => {
        const { result } = renderHook(() => useHistory())

        act(() => {
            result.current.addToHistory(finishedTask(1, 'Late night task', new Date('2026-08-08T02:00:00')))
        })
        act(() => {
            result.current.addToHistory(finishedTask(2, 'Morning task', new Date('2026-08-08T09:00:00')))
        })

        expect(result.current.history).toHaveLength(2)
        expect(result.current.history[0].date).toBe(new Date('2026-08-08T12:00:00').toDateString()) // newest first
    })

    it('removes a task from history by id, dropping the day once it is empty', () => {
        const { result } = renderHook(() => useHistory())

        act(() => {
            result.current.addToHistory(finishedTask(1, 'Task', new Date('2026-08-07T14:00:00')))
        })
        act(() => {
            result.current.removeFromHistory(1)
        })

        expect(result.current.history).toHaveLength(0)
    })
})
