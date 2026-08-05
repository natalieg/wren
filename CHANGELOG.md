# Changelog

Informal — versions map to Phase milestones in `design/_ROADMAP.md`, not a formal release process. Minor bump when a phase hits its MVP threshold, patch bump for smaller steps in between.

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
