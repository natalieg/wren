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

**Legend:** ✅ done · 🟡 today / actively in progress · 🔷 next up (roughly the next 3 steps)

### ✅ Phase 0 — Groundwork (done 2026-07-24)
- Imported and reviewed the Wren Design System (Claude Design MCP).
- Wrote this roadmap.
### 🟡 Phase 1 — Daylist MVP (home page revival) — working
The project stalled for ~4 months, partly from over-focusing on design last round with nothing usable to show for it. Priority #1 was a small, real, *used* thing: a daily task list living at the existing `/` "Home" route (`Main.jsx` → `Tasklist.jsx`, renamed from `Today.jsx` — see `design/life-balance.md` for why "today" and "tasklist" are different concepts), so there's an actual reason to open the app day to day. Deliberately not blocked on design-system migration — ship functional first, reskin later.
- ✅ 2026-07-24: done — **add** a task (`Input`), see it in the list (`TaskItem`), toggle done, persisted to localStorage. Styled with real design-system tokens registered in Tailwind's `@theme`, not inline styles.
- ✅ 2026-07-25: done — **delete** a single task, "delete all finished" bulk action.
- ✅ 2026-07-26/27: done — per-task **time estimate** (minutes), a done-vs-left time panel using a new reusable `Bar` component (`components/elements/Bar.jsx`, predefined `color` set + `freestyle` escape hatch).
- 🟥 Still open, not yet phased: `area` tag, archive instead of hard-delete (both `design/life-balance.md`) — revisit once Phases 4–5 give more shape to what tasks actually need.
### 🟡 Phase 2 — Task editing, time tracking, sorting & drag-and-drop — in progress
- ✅ 2026-07-24–28: done — add, toggle, delete, delete-all-finished, per-task time estimate, done-vs-left time panel (see Phase 1 log above for the earlier pieces).
- ✅ 2026-07-28: done — finished-tasks collapsible section, `formatTime` extracted + unit tested (Vitest set up), a real crash bug fixed (`setFinishedTasks`/`setFinishedTasksVisible` dead references from an earlier refactor), ESLint extension installed (`no-undef` now live in-editor).
- Natalie's explicit build order within this phase (2026-07-28): **tasks-to-bottom → edit → time tracking MVP → drag-and-drop.**
1. ✅ **Finished tasks sort to the bottom automatically** 
	1. via two separate filtered lists (`tasks.filter(t => !t.done)` / `tasks.filter(t => t.done)`, `.filter()` preserves order so no sort comparator needed), not one sorted array — done specifically so the finished section has a natural seam to become collapsible later (resolves the archive-vs-collapse open question in `design/life-balance.md`). Shipped as a collapsible section (`CollapsableDiv.jsx`) with a `grid-template-rows` open/close transition. ^472136
2. 🟡 **Edit a task's label and time estimate — decided: a popup, not inline/icon-based editing.** Claude originally suggested a dedicated edit icon (matching the delete ✕ pattern); Natalie pushed back with two arguments that won: (a) the row is already tight (checkbox, label, time chip, delete — see the squish bug fixed 2026-07-28) and a task item will only grow more fields over time (energy, XP, `#area`, project link, recurring pattern...) — a popup absorbs that growth without the row itself getting more cluttered, inline editing doesn't scale the same way; (b) **Jakob's Law**, backed by her own quick competitive check — she tested 4 other task apps just now and all four use an edit popup, so that's the pattern users already carry into Wren. Popup trigger, decided: the row's click-to-toggle moves to the checkbox only, freeing the rest of the row to open the popup. Also adding a Sunsama-style shortcut: hover a task + press `c` to mark it complete. Not built yet — next actual coding step.
3. 🔷 **Time tracking MVP** — real-time start/stop/pause tracking per task, not just the static estimate. Explicitly named as "its own little package" but prioritized deliberately: Natalie loses focus switching to separate time-tracking software, and pulling this into Wren directly serves the project's actual point (stop needing other tools). Loose design reference: `design/day-planning.md` sketch 1e ("running task" — pulsing indicator, live elapsed counter, progress vs. estimate, "you usually need ~38m" learned-estimate feedback) — not committing to that full polish yet, just the closest existing design thinking on this. Also lays groundwork for the ManicTime-import future idea (planned vs. *actual* time) without needing the external import at all yet.
4. 🔷 **Drag-and-drop reordering** via `dnd-kit` (Natalie's pick — solid, current choice for React DnD).
- Parse natural time input ("15m", "1h", "1h30") into minutes, for both add and edit, instead of a raw number field. Time/date parsing is a spot for Claude to help directly rather than hints-only (established exception, see the `feedback_workflow` memory).

### 🔷 Phase 3 — Areas
Promoted from a vague future-idea to a real phase: `area` (life-balance.md) needs to actually exist as a task field. Turned out to be a shared prerequisite for two different threads at once — life-balance's week/area tracking, and the gamification concept's stat system (task → area → stat, via the activity→stat mapping table in `design/wren-idle-konzept.md`) — so it earned its own phase rather than staying an unscheduled aside. Natalie's own dependency analysis (2026-07-27): build areas *before* wiring anything directly task→stat, or it'd need a redesign once areas land anyway.

### Phase 4 — Gamification MVP: character tab, no art
The smallest possible slice of `design/wren-idle-konzept.md`, deliberately scoped as a real hypothesis test, not a commitment to the full system: "do I actually look forward to opening Wren tomorrow morning?" Only after Phase 3 (Areas), per the dependency above.
- A character tab showing EXP per stat (INT/STR/AGI/VIT/DEX/LUK), computed from completed tasks' areas via the activity→stat table. No sprite, no art, no night/expedition loop yet.
- The full idle-game vision (day/night loop, dungeon expeditions, AI-generated narrative, pets, bosses, sprites/outfits, collections) stays exactly where Natalie's own doc sequences it (its Phase 2–4) — explicitly *not* pulled forward. That's real scope, comparable to everything else in this roadmap combined; building it now would repeat the "perfect one thing, everything else dies" pattern this whole roadmap exists to counter.

### Phase 5 — Simple day-aware time (needs pre-thought before coding)
Deliberately the *minimum* version, not the full `design/day-planning.md` timeline/day-tape vision (sketches 1h–1m) — those need real capacity data and UI work this phase explicitly skips for now.
- Now vs. remaining tasks → a projected finish time per task, computed sequentially (task N finishes at now + sum of estimates for tasks 1..N).
- A simple buffer/slack time concept alongside it (loose reference: `design/day-planning.md` sketch 1j's buffer rows).
- Natalie flagged this needs more design thought before implementation starts — don't jump straight to code here.

### Phase 6 — Day split: Tasklist vs. Today (medium future)
Makes the day/tasklist/task distinction from `design/life-balance.md` real in code for the first time — a general `Tasklist` (backlog, not yet scheduled) vs. a day-scoped view showing only tasks active *today*. Needs a new task property (`active` / `planned` — naming TBD) and operations to push a task into the future or pull it back into the general list.

### Phase 7 — Projects MVP (timing not decided)
A first, deliberately simpler version of "projects" than Natalie's original fuller design idea. A real pain point — this was the whole reason the last redesign attempt started — but explicitly acknowledged as not a small session. Revisit *when*, together, once Phases 2–6 give a better sense of how tasks and projects should actually connect (see `design/life-balance.md`'s "project-related tasks" type).

### Phase 8 — Design tokens into the app
Swap the current dark palette (`src/index.css`, `src/utils/constants.js`) for the new light-default token set — much of this already happened piecemeal while building Phases 1–3; this phase is really "finish it deliberately" rather than starting from zero.

### Phase 9 — Core component restyle
Bring in the new primitives one or two at a time (Button, Card/Panel, ProgressBar, Divider first — they map directly onto existing `Panel.jsx`, `Progressbar.jsx`, `Thinborder.jsx`). Badge, Checkbox, Input, Switch, Tabs, RetroWindow follow as they're actually needed by a feature.

### Phase 10 — Shell layout alignment
Restyle `Sidebar.jsx` / project view shell to match the `ui_kits/app` mockups (nav treatment, light/dark toggle, logo lockup).

### Phase 11 — First mini-app migration
Pick one reference app to fully migrate as a proof of the pattern — likely a simple day-planning one (`tagesliste.html` or `dayplan-picnic.html`) since that's closest to the Tasklist. Delete the source file once done.

### Phase 12 — Trackers & curricula migration
Work through the habit-tracker group, then the goals/curricula group, one at a time, each ending in a delete-the-reference-file step. Order to be decided together based on what's actually slowing you down day-to-day right now.

### Phase 13 — Daily-driver switch
Once enough coverage exists, start actually using Wren instead of Sunsama/pomo apps for personal stuff day-to-day, and let friction from real use drive remaining priorities.

### Phase 14 — In-app roadmap view (revised 2026-07-27)
Originally: recreate this roadmap as a Wren project object and retire this file. Reconsidered — Natalie flagged that once planning data lives only in Wren's own storage, Claude can't read or co-edit it directly the way a repo file works in conversation, which breaks the actual point of a *shared, collaborative* roadmap. **`ROADMAP.md` stays the canonical planning doc indefinitely**, regardless of anything else built in Wren itself. If an in-app view ever makes sense, it should be a display/mirror generated from this file, not a replacement that retires it.

## Future ideas (captured, not scheduled)
- **Focus modes:** a day/week "focus" setting (work, habits, balance, catch-up-on-neglected-things, procrastination-support) that changes *how* lists/plans are displayed — while all the underlying metadata of what was actually worked on that day is still tracked regardless of focus. Needs real design thought once there's more than one list type to reflow (post Phase 6). Concrete design exploration for the day-vs-tasklist split now exists — see `design/day-planning.md`; task-type taxonomy (recurring, growing-habit, project-linked) and the week-vs-day balance framing live in `design/life-balance.md`.
- **ManicTime import:** ManicTime does automated time tracking already. Eventually importing that data would let Wren compare planned vs. actual time use. Not urgent — revisit once Daylist/planning data actually exists to compare against.
- **Backend/database:** decision already made (not scheduled) — Python + FastAPI + SQLite, chosen deliberately over a hosted option for the learning/career value. Full reasoning and open questions in `design/data-architecture.md`. Realistically relevant around Phase 6–7, not before.
- **Books tab:** reading as its own feature area (to-read stack, page goals, day-list "continue this book" nudges, reading stats) — see `design/books.md`. Likely successor to `bookstack.html` in `references/`.
- **Full idle-game system:** everything beyond Phase 4's character-tab slice — day/night loop, dungeon expeditions, AI-generated narrative, collections, pets, bosses, Ragnarok-inspired class unlocks, character sprites/outfits — see `design/wren-idle-konzept.md` for the full concept and its own internal phasing. Real scope, intentionally not pulled into this roadmap's numbered phases yet.
- **Text-paste task parser (2026-07-28):** paste a block of free-flowing text, Wren parses discrete tasks out of it. Natalie's own framing: "nice to have but it would be REALLY nice to have." Directly serves how she already works — she uses Claude to sort scattered thoughts into structured plans constantly (this whole roadmap is evidence of that pattern), so this would be automating something already proven useful by hand. Natural fit once the Python/FastAPI backend (`design/data-architecture.md`) exists — paste text → LLM call → structured tasks. Not scheduled.

## Open questions (revisit together)
- `sporteinheiten-tracker.html` vs `-v2.html` — same thing, keep only v2?
- Any of the 17 reference apps already dead/unused and safe to just delete now rather than migrate?
- Which single tracker/planner is causing the most day-to-day friction right now — that should probably jump the queue in Phase 5/6.
