import { describe, it, expect, vi } from 'vitest'
import { buildActivityActions } from './activityTracking'

describe('buildActivityActions', () => {
    const setup = ({ runningTaskId = null, runningBreakId = null } = {}) => {
        const taskActions = { startTracking: vi.fn(), stopTracking: vi.fn() }
        const breakActions = { startBreak: vi.fn(), stopBreak: vi.fn() }
        const actions = buildActivityActions({ runningTaskId, runningBreakId, taskActions, breakActions })
        return { actions, taskActions, breakActions }
    }

    it('stops a running break before starting a task', () => {
        const { actions, taskActions, breakActions } = setup({ runningBreakId: 'gaming' })

        actions.startTracking('task-1')

        expect(breakActions.stopBreak).toHaveBeenCalledTimes(1)
        expect(taskActions.startTracking).toHaveBeenCalledWith('task-1')
    })

    it('stops a running task before starting a break', () => {
        const { actions, taskActions, breakActions } = setup({ runningTaskId: 'task-1' })
        const gaming = { id: 'gaming', name: 'gaming', emoji: '🎮' }

        actions.startBreak(gaming)

        expect(taskActions.stopTracking).toHaveBeenCalledTimes(1)
        expect(breakActions.startBreak).toHaveBeenCalledWith(gaming)
    })

    // regression: startBreak only restarts the clock, it doesn't flush — switching
    // types without stopping the old one first drops the accumulated seconds
    it('stops the running break before switching to a different type', () => {
        const { actions, breakActions } = setup({ runningBreakId: 'break' })

        actions.startBreak({ id: 'gaming', name: 'gaming', emoji: '🎮' })

        expect(breakActions.stopBreak).toHaveBeenCalledTimes(1)
        expect(breakActions.startBreak).toHaveBeenCalledTimes(1)
    })

    it('touches nothing on the other side when nothing is running', () => {
        const { actions, taskActions, breakActions } = setup()

        actions.startTracking('task-1')
        actions.startBreak({ id: 'break', name: 'break', emoji: '🍵' })

        expect(breakActions.stopBreak).not.toHaveBeenCalled()
        expect(taskActions.stopTracking).not.toHaveBeenCalled()
    })

    it('passes the plain stop actions straight through', () => {
        const { actions, taskActions, breakActions } = setup({ runningTaskId: 'task-1', runningBreakId: 'break' })

        actions.stopTracking()
        actions.stopBreak()

        expect(taskActions.stopTracking).toHaveBeenCalledTimes(1)
        expect(breakActions.stopBreak).toHaveBeenCalledTimes(1)
    })
})
