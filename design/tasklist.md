# Design plan: Tasklist

Test for Obsidian 

Covers `Tasklist.jsx` + `TaskItem.jsx` specifically — the task-list piece only. For the broader day-view/capacity concepts (a day composing one or more tasklists, time budgeting, etc.), see [day-planning.md](day-planning.md) — kept as a separate sprint doc on purpose.

Status: working (ROADMAP Phase 1) — add/toggle/persist all function, styled with real design-system tokens via Tailwind `@theme` (not inline style).

## Current state
- Route `/` → `src/pages/Main.jsx` (thin wrapper, just `DocWrapper` + content) → `src/pages/Tasklist.jsx` (actual content, renamed from `Today.jsx` — see [day-planning.md](day-planning.md) for why "Today" and "Tasklist" are being treated as different concepts).
- `DocWrapper` background is `var(--bg-base)` (light). Task rows use `.task-item` (card-shaped, `--radius-md`), input uses `.input` — both design-token-based.
- Checkbox is a custom styled `<span role="checkbox">` (design system's box+✦ look), not the design system's full `Checkbox` component (that one bundles a `<label>` click handler that would double-fire against the row's own click-to-toggle).

## Not done yet
- Delete a task (list only grows). See [day-planning.md](day-planning.md) sketch 1g for a ready hover-actions pattern + delete copy when this gets built.
- Edit a task's label.
- Linking a task to a project.
- Pill-shaped row instead of the current card/rect row (sketch 1a in [day-planning.md](day-planning.md) uses `--radius-pill`) — cosmetic, not urgent.

## Explicitly not doing yet
- Energy check-in row, XP/streak badges, "stuck? get a nudge" `RetroWindow` hook, task time estimates/duration, anything from the "Time & capacity" or "assembled day view" sections of [day-planning.md](day-planning.md) — those are day-level concerns, not tasklist-level, and depend on tasks having data (like a duration) they don't have yet.

## Open questions
- Real logo mark: the design system's `assets/logo-mark.svg` turned out to be the repo's Vite favicon recolored, not an actual Wren brand mark — doesn't block this page, but worth resolving before it spreads to more places.
- The page still visibly renders the heading "Today" even though the component is now `Tasklist` — intentional (reserving "Today" for a future day-view wrapper) or stale? See [day-planning.md](day-planning.md) open questions.
