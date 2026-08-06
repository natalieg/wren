# Shortcuts — reference

All hover-driven task shortcuts, kept in sync with the single source of truth at
`src/config/taskShortcuts.js`. Update both when adding or changing one.

Shortcuts fire based on which task is under the mouse cursor at the moment a key is
pressed (not on hover-enter state), so rapid-fire actions on consecutive tasks work
even when a task moves lists mid-sequence. They're suppressed while typing in a text
input. See `design/decisions.md` for why this replaced the old `mouseEnter`-based
approach.

## `tasks` context (Tasklist, Backlog)

| Key | Effect | Condition |
|---|---|---|
| `c` | Mark task done | task isn't already done |
| `a` | Mark task active | task isn't already active |
| `p` | Park task (mark inactive) | task is active |
| `1` | Move to backlog bucket: Next up | task is in backlog |
| `2` | Move to backlog bucket: Next week | task is in backlog |
| `3` | Move to backlog bucket: Someday | task is in backlog |
| `↓` | Push task to bottom of the active list | task is active |
| `space` | Start/stop time tracking | task isn't done — works from the backlog too, pulls the task into 'active' |

## `MultiSwitchFlag` (Backlog bucket switch)

Not part of the hover-resolution system above — it's a single persistent control
(never unmounts mid-interaction), so a plain hover-focuses-the-element trick is
enough: `onMouseEnter` calls `.focus()`, which makes the existing keyboard handler
fire on hover too, no separate listener needed. See `src/components/elements/MultiSwitchFlag.jsx`.

| Key | Effect |
|---|---|
| `→` | Step forward (same direction as left click) |
| `←` | Step backward (same direction as right click / context menu) |
| `space` | Step forward |
| `Enter` | Submit if wired up (e.g. Backlog's input row), otherwise step forward |

## Future contexts

New views that show tasks (Projects, Recurring, …) can reuse a key with different
meaning by giving their `TaskItem`s a different `data-task-context` and adding
matching entries to `taskShortcuts.js` — e.g. a `1`/`2`/`3` priority context for
project tasks, without touching the `tasks` context above.
