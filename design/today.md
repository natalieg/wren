# Design plan: Today (home) page

Status: functional shell exists (ROADMAP Phase 1), not yet reskinned to the new design system.

## Current state
- Route `/` → `src/pages/Main.jsx` (thin wrapper, just `DocWrapper` + content) → `src/pages/Today.jsx` (actual content).
- Still on the old dark palette: `DocWrapper` hardcodes `background="#1d4c59"`, rows use the old `.panel`/`.header` classes from `src/index.css`.

## Target (once ROADMAP Phase 2 tokens land)
- Background: `var(--bg-base)` (light) instead of the hardcoded teal.
- Task rows: card-ish treatment — thin `var(--border-soft)` border, `var(--radius-md)`, hover lift per the design system's motion guidelines.
- Checkbox: swap the native checkbox for the design system's `Checkbox` component once ported (Phase 3).
- Heading: `Cinzel Decorative` for "Today" (display rule), list items stay in `Quicksand`.
- Loose layout reference: `ui_kits/app/TodayView.jsx` in the Wren Design System project — not committing to its extras yet (see below), just borrowing the general shape.

## Explicitly not doing yet
- Energy check-in row, XP/streak badges, "stuck? get a nudge" `RetroWindow` hook — good ideas from the mockup, but they're a later phase once the base list is actually built and used daily.

## Open questions
- Real logo mark: the design system's `assets/logo-mark.svg` turned out to be the repo's Vite favicon recolored, not an actual Wren brand mark — doesn't block this page, but worth resolving before it spreads to more places.
