import { describe, it, expect, vi } from 'vitest'
import { buildActivityActions } from './activityTracking'

describe('buildActivityActions', () => {
    const setup = ({ runningTaskId = null, runningBreakId = null } = {}) => {
        const taskActions = { startTracking: vi.fn(), stopTracking: vi.fn() }
        const breakActions = { startBreak: vi.fn(), stopBreak: vi.fn() }
        const updateActionTime = vi.fn()
        const actions = buildActivityActions({ runningTaskId, runningBreakId, taskActions, breakActions, updateActionTime })
        return { actions, taskActions, breakActions, updateActionTime }
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

    it('passes stopTracking straight through', () => {
        const { actions, taskActions } = setup({ runningTaskId: 'task-1' })

        actions.stopTracking()

        expect(taskActions.stopTracking).toHaveBeenCalledTimes(1)
    })

    // resuming from a break shouldn't let the idle break time count against task
    // estimates, so stopping one bumps the same checkpoint editing a task does
    it('bumps the action-time checkpoint when a break stops', () => {
        const { actions, breakActions, updateActionTime } = setup({ runningBreakId: 'break' })

        actions.stopBreak()

        expect(breakActions.stopBreak).toHaveBeenCalledTimes(1)
        expect(updateActionTime).toHaveBeenCalledTimes(1)
    })
})
