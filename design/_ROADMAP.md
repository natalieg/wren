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

**Legend:** ✅ done · 🟡 today / actively in progress · 🔷 next up (roughly the next 3 steps) · 🟥 open/unresolved question, not yet scheduled

Background/reasoning for decisions lives in `design/decisions.md`, not here — keep entries below short and bulleted.

### ✅ Phase 0 — Groundwork (done 2026-07-24)
- Imported and reviewed the Wren Design System (Claude Design MCP).
- Wrote this roadmap.
### ✅ Phase 1 — Daylist MVP (home page revival) — working
Home route (`/` → `Tasklist.jsx`) — a real, used daily task list. Ship functional first, reskin later.
- ✅ 2026-07-24: add, display, toggle done, persist to localStorage — real design-system tokens via Tailwind `@theme`, not inline styles.
- ✅ 2026-07-25: delete a task, "delete all finished."
- ✅ 2026-07-26/27: per-task time estimate, done-vs-left `Bar` panel.

### 🟡 Phase 2 — Task editing, time tracking, sorting & drag-and-drop — in progress
Build order: tasks-to-bottom → edit → time tracking MVP → drag-and-drop.
- ✅ 2026-07-28: finished tasks sort into a collapsible section (`CollapsableDiv.jsx`).
- ✅ 2026-07-28: `formatTime` extracted to `src/utils/` + unit tested (Vitest set up).
- ✅ 2026-07-28: fixed a real crash bug (dead `setFinishedTasks`/`setFinishedTasksVisible` refs) — ESLint extension now installed and live in-editor.
- ✅ 2026-07-31: extracted the time-display panel into its own `TimeProgress.jsx`.
- ✅ 2026-08-01: cascading per-task estimate (`useTasks.js`'s `openTasks`/`baseTime` reduce) and inactive-task preview estimates anchored off the active queue; `newActionTime` checkpoint that only refreshes when nothing's active, so resuming from idle doesn't produce stale estimates.
- ✅ 2026-08-01: real active time tracking — start/stop per task (`PlayBtn`/`TimeFlag`), live ticking, persisted `trackedTime` with a 5min failsafe flush against accidental refresh/close. Switching tasks flushes and stops the old one, and settles it right below the new running task in the list instead of jumping back to its original position. The running task anchors the whole cascade off its own real remaining time, falling back to `now` once it runs over its own estimate. Covered by tests in `useTasks.test.js`. Full model/reasoning: `design/decisions.md`.
1. ✅ Sort finished tasks to bottom, collapsible section.
2. ✅ Edit task label/time via a popup modal — reasoning in `design/decisions.md`.
3. 🟡 Time tracking MVP — ref: `design/day-planning.md` sketch 1e. Real-time start/stop, live display, switching, and the failsafe: done (above). Still open:
   - 🔷 Edit modal doesn't reflect time-tracking fields yet — and could double as a "focus mode" showing a tracking bar for the running task (Natalie's flag, 2026-08-01: "especially neat for the modal").
   - Fill-up progress bar for the running task's own card, not just the modal.
   - Rename `time` → `timeLeft` once the data model needs to distinguish planned time from remaining time.
   - ✅ 2026-08-01: starting tracking on an inactive task now also sets it `active`; parking the running task via the edit modal now also stops tracking; `sortedActiveTasks` falls back gracefully if `runningTaskId` ever points at a task outside `activeTasks`.
   - ✅ 2026-08-01: legacy finished tasks missing `finishedTimestamp` no longer poison `baseTime` — invalid timestamps are filtered out of the `Math.max` instead of trusting every record has one. Hit live on the deployed site, fixed and pushed same day.
   - ✅ 2026-08-01: pausing the running task now stays at the top instead of dropping back to its stored position — `stopTracking()` persists the same front-of-list reorder `startTracking()`'s switch already did.
4. 🔷 Drag-and-drop via `dnd-kit` — Natalie wants to get to this soon (2026-08-01).
- Next up: natural time input parsing ("15m"/"1h" → minutes) for add + edit — time/date math is a spot Claude helps directly, not hints-only (see `feedback_workflow` memory).

### 🔷 Phase 3 — Areas
- Area Tab 
	- Create new Area, [Name] 
		- Optional: Default Effort?
		- Default Prio?
	- Overview of all areas in a card grid
		- [] [] [] 
	- Sort areas by prio etc , 
	- maybe 'pin focus area
		- later:[ for x days]'
- Area tag in Tasks <-> Create Tasks in Area card
- Area gamification connection 

`area` (life-balance.md) needs to actually exist as a task field. Turned out to be a shared prerequisite for two different threads at once — life-balance's week/area tracking, and the gamification concept's stat system (task → area → stat, via the activity→stat mapping table in `design/wren-idle-konzept.md`) — so it earned its own phase rather than staying an unscheduled aside. Natalie's own dependency analysis (2026-07-27): build areas *before* wiring anything directly task→stat, or it'd need a redesign once areas land anyway.
- 🟥 Open: `area` tag itself, archive-instead-of-delete — see `design/life-balance.md`.

### Simple Export/Import
Inbetween Broswerstorage and real Database, there is a need to save the json and being able to import it again 

### Recurring Tasks / Habits & Reflection
- Set Tasks to Recurring [maybe stikc to the name 'habits' for clarity]
- Tab to view all recurring tasks 
- Set to day/week/month etc
- Set to certain days or ever x days etc
- [later] Recurring Task buildup (start with x min goal is x min)
- Overview Fail/Success of tasks, growth over time etc 
- Review what tasks are done, what tasks are being neglected
	- review if some #recTasks should change their `time`, `rec Rhytmn` or `priority` or maybe even `pause` for x days/weeks etc 
- #overview get insight into realistic effort 
	- with `x habits`, you need `x hours` per day, you also have `x projects` that accumulate to `x hours` ▶ ⌈4h⌉ is this realistic? 
		- this could also be a space to include things we usually do not track/plan like eating, shower, shopping, etc 'pre emptive time blocking' to get a more realistic view of the day
- #Energy⚡ handling > `Min` and `max` Energy per Habit (eg. yoga: 5 to 20, could also grow with accumulation, min could stay same, max could grow up to 50) 
	- View of `min Energy day` vs `max energy day` eg **⌈2h⌉** vs **⌈6h⌉** 


### Phase 4 — Gamification MVP: character tab, no art
The smallest possible slice of `design/wren-idle-konzept.md`, deliberately scoped as a real hypothesis test, not a commitment to the full system: "do I actually look forward to opening Wren tomorrow morning?" Only after Phase 3 (Areas), per the dependency above.
- A character tab showing EXP per stat (INT/STR/AGI/VIT/DEX/LUK), computed from completed tasks' areas via the activity→stat table. No sprite, no art, no night/expedition loop yet.
- The full idle-game vision (day/night loop, dungeon expeditions, narrative, pets, bosses, sprites/outfits, collections) stays exactly where Natalie's own doc sequences it (its Phase 2–4) — explicitly *not* pulled forward. That's real scope, comparable to everything else in this roadmap combined; building it now would repeat the "perfect one thing, everything else dies" pattern this whole roadmap exists to counter.

### Subtasks, Tasks extendet
- tasks can hold subtasks with own est time, this will overwrite the task est time and acc the subtask leftTime instead 
- task can be split if user can only handle x subtasks for the day into a new bundle for tomorrow or parking  
- tasks holds 'created date' 
	- can display how many days you've been procrastinating a task. this is ony true for tasks that are either in 'active' or 'parking', if a task is put into backlog this 'prcorastination days' resets on new planning
- Move tasks from parking into backlog:
	- (before i wasnt sure if i want backlog AND parking, but i think parking is more for the day itself, backlog is for long term planning and idea dumping)
	- offer re-evaluation:
		- is important?
		- has deadline? 
		- think about this in a month? (gets some kind of alert )

### Day Planning extendet
Check if there are more features in  [[day-planning]]
- ✅ Now vs. remaining tasks → a projected finish time per task, computed sequentially — built as part of Phase 2's time tracking MVP (`openTasksResult` cascade in `useTasks.js`), not separately.
- 🟥 buffer/slack time concept (loose reference: `design/day-planning.md` sketch 1j's buffer rows) — revisit if it turns out to matter once time tracking's been used for a while.
- Different ways to start the day:
	-	start with template for eg 'wednesday' -> all recurring tasks for a wednesday are pulled, rest of the day is filled by the rules of energy/time 
	- day starts empty: user pulls relevant tasks into the day, switches in the sidebar between templates, recurring etc to put the day together themselves 
	- Project Focus
- Real `Deadline` for the end of the day: make it visible when tasks dip into timezones that are set as 'downtime after x' eg 22:00, all tasks in 21:00 get a yellow 'finished time', after that red
	- #later Wren suggests how to handle rest of day:
		- do you want to park the tasks for tomorrow?
		- do you want to split the tasks? (especially the long ones, should suggest those in a list)
		- do you want to do the minimum of `list` ? 
		- > in all those, the user should always have the freedom to choose tasks to apply this to 
- Evening Journal: 
	- last thing of the day could be a quick journal prompt
		- text input, emoji, hashtags 
		- could be used to get some insights: 
			- on days where you work for x hours you are usually tired and frustrated
			- when you do art, you feel calm
		- of course, this would just be something the user can reflect on themselves, having a good mood is not always connected to art, maybe you did art because you had good mood etc 

### View different Days, pre planning
- Plan tomorrow
- view yesterday etc
- Weekview
- #later Week View, 
- #later Month View
- maybe a moment to reflect on statistics, minimum first as always 

### 🟡 Phase 6 — Parking / active tasks, more Task handling
- ✅ 2026-07-29: `active` field (defaults `true` on creation), toggle via edit modal or hover shortcuts (`a` activate, `p` park). `TaskGroup.jsx` extracted; parked tasks sit in their own collapsible section.
- 🔷 Open: move the parked-tasks panel from above the active list to beside it (collapsible sidebar) — the original ask, deferred since the MVP works without it.
- #taskSplitting split longer tasks into smaller sections, allowing the user to move those into the next x days or into the parking area 
	- could have functions like: split this `4h tasks` into `4 bites` and schedule them for the next `4 days` 
- #question should there be a different 'backlock' for tasks that are not yet 'in the queue' but rather long term planning eg `next week, next month etc` BUT those should be suggested when actual time passes, unlike sunsama where this doesnt really mean anything. 

### Phase 7 — Projects MVP (timing not decided)
A first, deliberately simpler version of "projects" than Natalie's original fuller design idea. A real pain point — this was the whole reason the last redesign attempt started — but explicitly acknowledged as not a small session. Revisit *when*, together, once Phases 2–6 give a better sense of how tasks and projects should actually connect (see `design/life-balance.md`'s "project-related tasks" type).

### Phase 10 — Shell layout alignment
Restyle `Sidebar.jsx` / project view shell to match the `ui_kits/app` mockups (nav treatment, light/dark toggle, logo lockup).

### Phase 11 — First mini-app migration
Pick one reference app to fully migrate as a proof of the pattern — likely a simple day-planning one (`tagesliste.html` or `dayplan-picnic.html`) since that's closest to the Tasklist. Delete the source file once done.
#### SubPhase — Trackers & curricula migration
Work through the habit-tracker group, then the goals/curricula group, one at a time, each ending in a delete-the-reference-file step. Order to be decided together based on what's actually slowing you down day-to-day right now.

### Long Term Planning
- plan week
- plan month
- plan quarter
- plan year
- the idea is mostly to have some overview over different goals and how realistic they are 
	- interesting balancing challenge: could a single project have meaningful goals for each step? eg 'comic' yeargoal 100pages, quarter 25 pages etc. could be displayed in the current project progress as well as the planning view 
	- are things on track? should things be re-evaluated? 

### User Settings
- With more tabs and functionality potential, there is a real need to have tabs/features optional for a user
- small settings too like tracking behaviour, default sort etc

### Phase 14 — In-app roadmap view (revised 2026-07-27)
Originally: recreate this roadmap as a Wren project object and retire this file. Reconsidered — Natalie flagged that once planning data lives only in Wren's own storage, Claude can't read or co-edit it directly the way a repo file works in conversation, which breaks the actual point of a *shared, collaborative* roadmap. **`ROADMAP.md` stays the canonical planning doc indefinitely**, regardless of anything else built in Wren itself. If an in-app view ever makes sense, it should be a display/mirror generated from this file, not a replacement that retires it.

## Future ideas (captured, not scheduled)
- **Focus modes:** a day/week "focus" setting (work, habits, balance, catch-up-on-neglected-things, procrastination-support) that changes *how* lists/plans are displayed — while all the underlying metadata of what was actually worked on that day is still tracked regardless of focus. Needs real design thought once there's more than one list type to reflow (post Phase 6). Concrete design exploration for the day-vs-tasklist split now exists — see `design/day-planning.md`; task-type taxonomy (recurring, growing-habit, project-linked) and the week-vs-day balance framing live in `design/life-balance.md`.
- **ManicTime import:** ManicTime does automated time tracking already. Eventually importing that data would let Wren compare planned vs. actual time use. Not urgent — revisit once Daylist/planning data actually exists to compare against.
- **Backend/database:** decision already made (not scheduled) — Python + FastAPI + SQLite, chosen deliberately over a hosted option for the learning/career value. Full reasoning and open questions in `design/data-architecture.md`. Realistically relevant around Phase 6–7, not before.
- **Books tab:** reading as its own feature area (to-read stack, page goals, day-list "continue this book" nudges, reading stats) — see `design/books.md`. Likely successor to `bookstack.html` in `references/`.
- **Full idle-game system:** everything beyond Phase 4's character-tab slice — day/night loop, dungeon expeditions, AI-generated narrative, collections, pets, bosses, Ragnarok-inspired class unlocks, character sprites/outfits — see `design/wren-idle-konzept.md` for the full concept and its own internal phasing. Real scope, intentionally not pulled into this roadmap's numbered phases yet.
- **Text-paste task parser (2026-07-28):** paste a block of free-flowing text, Wren parses discrete tasks out of it. Natalie's own framing: "nice to have but it would be REALLY nice to have." Directly serves how she already works — she uses Claude to sort scattered thoughts into structured plans constantly (this whole roadmap is evidence of that pattern), so this would be automating something already proven useful by hand. Natural fit once the Python/FastAPI backend (`design/data-architecture.md`) exists — paste text → LLM call → structured tasks. Not scheduled.
- **ADHD Hyperfocus tracking** eg: 'you usually keep up with a habit for x days'
  the idea behind this is not to shame but to show the reality of living with adhd and find some self reflection, maybe even making it easier to accept that interests come and go in bursts. it's ok to retire habits, it's ok to get them back up. what makes you happy in what phase of your life? 

### 


## Open questions (revisit together)
- `sporteinheiten-tracker.html` vs `-v2.html` — same thing, keep only v2?
- Any of the 17 reference apps already dead/unused and safe to just delete now rather than migrate?
- ~~Which single tracker/planner is causing the most day-to-day friction right now~~ — answered: parking/inactive tasks (2026-07-29), which is why Phase 6 jumped the queue.
