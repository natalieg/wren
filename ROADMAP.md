# Wren Roadmap

A living, working document — not a spec. Update phase status as we go instead of re-planning from scratch each session.

## The vision

Right now daily life runs across Sunsama, ClickUp, a handful of pomodoro apps, and ~17 standalone single-page mini-apps in `references/` (trackers, planners, curricula). ClickUp stays for work. Everything else — private planning, habit/practice tracking, day structure, procrastination help — should eventually live in **Wren**.

This is a slow build alongside freelance work and art practice, not a sprint. Small, reviewable increments beat big rewrites.

## Working agreement

- **Max 3 file changes per unprompted batch.** Anything bigger stops and asks first.
- Work through `references/` one file at a time. Delete a reference file only once its useful parts are actually migrated in — never preemptively.
- Prefer incremental visible progress (something you can look at / use each session) over long invisible groundwork.
- **Shells vs. implementation:** Claude can rough in empty/skeleton structure (new component files, routing, folder layout) without asking first. Actual implementation (data model, logic, persistence) gets designed together before it's written.
- **Daily quest:** when there's a natural next coding step, offer it to Natalie as a self-implement quest with hints, not finished code — the point is to keep dev skills warm, not just to ship fast.
- This project has stalled before (multiple times, always by restarting from scratch on a new project instead of continuing an old one). The explicit goal this round is to **rework what's already here**, not start over. If a "maybe we should just rebuild this part" temptation comes up, flag it explicitly rather than just doing it.

## Design system

Imported (read-only, not yet applied) from the Claude Design MCP project **"Wren Design System"**. Full source of truth lives there — this is just the summary:

- **Direction:** the old dark mauve/teal/near-black scaffold is being replaced with a **light-default**, "90s-retro witchy pastel" theme. Dark theme stays available (`[data-theme]`), just not default anymore.
- **Palette:** violet primary, gold secondary (kept from the old brand), mint/peach/pink/sky as playful gamification accents, plum-tinted neutrals.
- **Type:** Cinzel Decorative (display/logo only), Cinzel (nav/headings, small doses), **Quicksand** (all body text — the actual readability fix), VT323 (retro-mono, stat counters/timers/window-chrome only).
- **Signature motif:** `RetroWindow` — a 90s-OS dialog (title bar, window controls) for gentle, low-pressure procrastination-help nudges. Voice: warm, second person, never scolding.
- **Delivered components:** Button, Card, Divider, Badge, ProgressBar, Checkbox, Input, Switch, NavItem, Tabs, RetroWindow — plus click-through mockups of Sidebar, TodayView, WeekView, ProjectsView built against Wren's actual shape.

## Reference apps inventory

Not yet deeply read — titles/rough grouping only, confirm details when each is actually tackled.

| Group | Files |
|---|---|
| Day/task planning | `tagesliste.html`, `dayplan-picnic.html` |
| Goals & curricula | `goals.html`, `challenge.html`, `dti-challenge.html`, `proko-curriculum.html`, `proko-curriculum-anatomy.html`, `artplan.html`, `botanical-30-days.html` |
| Habit/practice trackers | `sport-tracker.html`, `sporteinheiten-tracker.html` + `-v2.html` (v2 may supersede v1 — confirm), `croquis-tracker.html`, `elvanse_tracker.html`, `mwi-tracker.html` |
| Misc | `bookstack.html` (reading), `klavier_wochenplan_v2/v3.html` (piano weekly plan) |

## Phases

Rough sequencing, not a hard commitment — reorder freely as priorities shift.

### Phase 0 — Groundwork (done 2026-07-24)
- Imported and reviewed the Wren Design System (Claude Design MCP).
- Wrote this roadmap.

### Phase 1 — Daylist MVP (home page revival) — in progress
The project stalled for ~4 months, partly from over-focusing on design last round with nothing usable to show for it. Priority #1 is a small, real, *used* thing: a daily task list living at the existing `/` "Home" route (`src/pages/Main.jsx`), so there's an actual reason to open the app day to day. Deliberately not blocked on design-system migration — ship functional first, reskin later.
- 2026-07-24: rough shell in place (`Main.jsx` renders a toggleable task list, in-memory only, one placeholder task).
- Next (to design together, not just implement solo): real data model, add/remove tasks, persistence (localStorage to start — no backend exists yet), maybe a first pass at linking a task to a project.
- Good candidate for a "daily quest": Natalie implements the add/persist logic herself with hints, rather than Claude just writing it.

### Phase 2 — Design tokens into the app
Swap the current dark palette (`src/index.css`, `src/utils/constants.js`) for the new light-default token set. Small, isolated, low-risk. No component behavior changes, just the visual base layer (colors, fonts, spacing/radius/shadow tokens).

### Phase 3 — Core component restyle
Bring in the new primitives one or two at a time (Button, Card/Panel, ProgressBar, Divider first — they map directly onto existing `Panel.jsx`, `Progressbar.jsx`, `Thinborder.jsx`). Badge, Checkbox, Input, Switch, Tabs, RetroWindow follow as they're actually needed by a feature.

### Phase 4 — Shell layout alignment
Restyle `Sidebar.jsx` / project view shell to match the `ui_kits/app` mockups (nav treatment, light/dark toggle, logo lockup).

### Phase 5 — First mini-app migration
Pick one reference app to fully migrate as a proof of the pattern — likely a simple day-planning one (`tagesliste.html` or `dayplan-picnic.html`) since that's closest to the Daylist. Delete the source file once done.

### Phase 6 — Trackers & curricula migration
Work through the habit-tracker group, then the goals/curricula group, one at a time, each ending in a delete-the-reference-file step. Order to be decided together based on what's actually slowing you down day-to-day right now.

### Phase 7 — Daily-driver switch
Once enough coverage exists, start actually using Wren instead of Sunsama/pomo apps for personal stuff day-to-day, and let friction from real use drive remaining priorities.

### Phase 8 — Meta project in Wren itself
Once Wren can represent projects with subprojects/goals well, recreate this roadmap as an actual Wren project object and retire this file.

## Future ideas (captured, not scheduled)
- **Focus modes:** a day/week "focus" setting (work, habits, balance, catch-up-on-neglected-things, procrastination-support) that changes *how* lists/plans are displayed — while all the underlying metadata of what was actually worked on that day is still tracked regardless of focus. Needs real design thought once there's more than one list type to reflow (post Phase 1).
- **ManicTime import:** ManicTime does automated time tracking already. Eventually importing that data would let Wren compare planned vs. actual time use. Not urgent — revisit once Daylist/planning data actually exists to compare against.

## Open questions (revisit together)
- `sporteinheiten-tracker.html` vs `-v2.html` — same thing, keep only v2?
- Any of the 17 reference apps already dead/unused and safe to just delete now rather than migrate?
- Which single tracker/planner is causing the most day-to-day friction right now — that should probably jump the queue in Phase 5/6.
