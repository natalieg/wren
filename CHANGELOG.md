# Changelog

Informal — versions map to Phase milestones in `design/_ROADMAP.md`, not a formal release process. Minor bump when a phase hits its MVP threshold, patch bump for smaller steps in between.

## 0.4.0 — 2026-08-07
- Settings MVP (`/settings`, `useSettings.js`, `utils/settings.js`) — persisted settings object in localStorage, merged over `DEFAULT_SETTINGS` on load so later-added settings get a sane value for existing users. `InputRow`/`CheckboxRow` rows.
- Configurable rollover hour (`utils/rollover.js`) — the day boundary shifts off midnight, so e.g. 3:59am still counts as yesterday. History groups finished tasks by logical day.
- Configurable default start time; new day starts at the later of now / the planned start, so estimates never cascade from the past. Manual "start now" reset.
- First rollover actions: auto-activate `nextUp` backlog tasks and auto-delete finished tasks on a new day, each behind its own setting.
- `useDayActions.js` owns the day boundary and `startedAt`; task side effects are passed in via `onRollover`, keeping task logic in `useTasks`.
- Dev-only "Simulate next rollover" button on the settings page (pushes `startedAt` 25h back and reloads).
- Tests for rollover, day actions, history grouping, and legacy task migration.

## 0.3.1 — 2026-08-06
- Task keyboard shortcuts (`config/taskShortcuts.js`, `useTaskKeyboardShortcuts.js`), incl. on the Backlog page.
- Keyboard navigation for `MultiSwitchFlag`; backlog tasks can be submitted straight from the flag.
- Tasks can be moved to the bottom of the list.
- Fix: edit modal no longer vanishes when a task changes context.

## 0.3.0 — 2026-08-05
- Backlog MVP (`/backlog` route). Task data model consolidated to a single `list: 'active'|'done'|'backlog'` enum plus `backlog: {bucket, activationDate}` (buckets: `nextUp`/`nextWeek`/`someday`). Legacy tasks migrate on load.
- Shared `TaskInput` and `SwitchFlag` components (bucket picker on add + in edit modal).
- Bucket reassignment via ▲/▼ shift arrows on the Backlog page.

## 0.2.0 — 2026-08-04
- History page (`/history`, `useHistory.js`) — finished tasks archive separately from the active list, survive deletion.
- `TasksProvider`/`TasksContext` lifted to `App.jsx` so the running timer survives in-app navigation.
- `FloatingTaskPanel.jsx` — draggable mini panel mirroring the tracked task on non-Home pages.
- Real time tracking: start/stop per task, live ticking, persisted `trackedTime`, 5min failsafe flush, cascading per-task estimates.
- Edit task label/time via modal; finished tasks sort into a collapsible section.

## 0.1.0 — 2026-07-27
- Daylist MVP (`/` → `Tasklist.jsx`): add, display, toggle done, delete, "delete all finished," persist to localStorage.
- Per-task time estimate, done-vs-left `Bar` panel.
