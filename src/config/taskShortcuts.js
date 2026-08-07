import {DONE, ACTIVE, BACKLOG, NEXTUP, NEXTWEEK, SOMEDAY} from '../utils/constants'

// Single source of truth for hover-driven task shortcuts, matched against
// data-task-context on the hovered element (see useTaskKeyboardShortcuts).
// Mirrored in design/_Shortcuts.md — update both when changing this table.
const taskShortcuts = [
    {
        context: 'tasks',
        key: 'c',
        label: 'Mark task done',
        condition: (task) => task.list !== DONE,
        action: (task, actions) => actions.toggleDone(task.id),
    },
    {
        context: 'tasks',
        key: 'a',
        label: 'Mark task active',
        condition: (task) => task.list !== ACTIVE,
        action: (task, actions) => actions.toggleActive(task.id),
    },
    {
        context: 'tasks',
        key: 'b',
        label: 'Task into backlog (mark inactive)',
        condition: (task) => task.list === ACTIVE,
        action: (task, actions) => actions.toggleActive(task.id),
    },
    {
        context: 'tasks',
        key: '1',
        label: 'Move backlog task to bucket: Next up',
        condition: (task) => task.list === BACKLOG,
        action: (task, actions) => actions.handleFieldChange(task.id, BACKLOG, { ...task.backlog, bucket: NEXTUP }),
    },
    {
        context: 'tasks',
        key: '2',
        label: 'Move backlog task to bucket: Next week',
        condition: (task) => task.list === BACKLOG,
        action: (task, actions) => actions.handleFieldChange(task.id, BACKLOG, { ...task.backlog, bucket: NEXTWEEK }),
    },
    {
        context: 'tasks',
        key: '3',
        label: 'Move backlog task to bucket: Someday',
        condition: (task) => task.list === BACKLOG,
        action: (task, actions) => actions.handleFieldChange(task.id, BACKLOG, { ...task.backlog, bucket: SOMEDAY }),
    },
    {
        context: 'tasks',
        key: 'ArrowDown',
        label: 'Push task to bottom of the active list',
        condition: (task) => task.list === ACTIVE,
        action: (task, actions) => actions.pushToBottom(task.id),
    },
    {
        context: 'tasks',
        key: ' ',
        label: 'Start/stop time tracking',
        // works from the backlog too — starting tracking pulls the task into 'active' (see useTasks.startTracking)
        condition: (task) => task.list !== DONE,
        action: (task, actions) => task.id === actions.runningTaskId ? actions.stopTracking() : actions.startTracking(task.id),
    },
]

export default taskShortcuts
