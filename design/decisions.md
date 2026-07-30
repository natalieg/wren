# Decisions — reference

The "why" behind decisions made along the way, kept out of `_ROADMAP.md` on purpose so the roadmap itself stays short and scannable. Look here when you want the reasoning, not just the outcome.

## Edit UI: popup, not inline icon (2026-07-28)

Claude originally suggested a dedicated edit icon (matching the delete ✕ pattern). Natalie pushed back with two arguments that won:
- The row is already tight (checkbox, label, time chip, delete — see the squish bug fixed 2026-07-28), and a task item will only grow more fields over time (energy, XP, `#area`, project link, recurring pattern...). A popup absorbs that growth without the row getting more cluttered; inline editing doesn't scale the same way.
- **Jakob's Law**, backed by a quick competitive check — 4 other task apps tested, all four use an edit popup, so that's the pattern users already carry into Wren.

Popup trigger: the row's click-to-toggle moved to the checkbox only, freeing the rest of the row to open the popup. Also added a Sunsama-style shortcut: hover a task + press `c` to mark it complete.

## Finished-tasks sorting: two filtered lists, not one sorted array (2026-07-28)

`tasks.filter(t => !t.done)` / `tasks.filter(t => t.done)`, not a single sorted array — `.filter()` preserves order so no sort comparator is needed, and it gives the finished section a natural seam to become its own collapsible area, resolving the archive-vs-collapse question from `design/life-balance.md`.

## Time MVP: projected finish time as its own field, not inline (2026-07-31)

Estimated finish time per task ("Task 1 20min" → "12:30") displayed as a separate field to the *right* of the task row, not folded into `TaskItem` itself — two visually distinct boxes per row, e.g. `[ Task 1  20min ]  [ 12:30 ]`.

Why, in Natalie's own reasoning:
- Times stacking in their own column read far easier than times embedded inline in each row — a column of numbers scans faster than the same numbers scattered across rows.
- This is a cheap way to simulate a low-level "timeline" (this is `ROADMAP.md` Phase 5's projected-finish-time concept, pulled forward) without building the real timeline visualization yet (`design/day-planning.md` sketch 1j, "soft timeline rail" — still not needed for this).
- A show/hide toggle at the top removes it from view entirely when she doesn't want it.

**Not decided yet, on purpose:** the actual layout/display mechanism (how the second field sits next to `TaskItem` without breaking the current row layout). Explicitly deferred to when this is actually built, not decided now.

## Backend/database: Python + FastAPI over a hosted option (2026-07-27)

Considered Supabase (faster, less to learn) vs. Python + FastAPI + SQLite. Chose FastAPI deliberately, not as the easy default — Natalie wants real backend skills for career reasons, already has Python from another project, and works alongside a backend dev she wants to understand better. Full writeup: `design/data-architecture.md`.
