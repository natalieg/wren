# Wren Roadmap

A living, working document — not a spec. Update phase status as we go instead of re-planning from scratch each session.

Context that used to live here, moved out 2026-08-07 to keep this file to phases only:
`design/working-agreement.md` (vision + how we work) · `design/design-system.md` · `design/references-inventory.md`

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

### ✅ Phase 2 — Task editing & time tracking (closed 2026-08-09)
   Build order: tasks-to-bottom → edit → time tracking MVP. (Drag-and-drop split out into its own phase, 2026-08-06 — see Phase 3 below — since it sat untouched as "step 4" while smaller MVPs kept jumping the queue ahead of it.)
- ✅ 2026-07-28: finished tasks sort into a collapsible section (`CollapsableDiv.jsx`).
- ✅ 2026-07-28: `formatTime` extracted to `src/utils/` + unit tested (Vitest set up).
- ✅ 2026-07-28: fixed a real crash bug (dead `setFinishedTasks`/`setFinishedTasksVisible` refs) — ESLint extension now installed and live in-editor.
- ✅ 2026-07-31: extracted the time-display panel into its own `TimeProgress.jsx`.
- ✅ 2026-08-01: cascading per-task estimate (`useTasks.js`'s `openTasks`/`baseTime` reduce) and inactive-task preview estimates anchored off the active queue; `newActionTime` checkpoint that only refreshes when nothing's active, so resuming from idle doesn't produce stale estimates.
- ✅ 2026-08-01: real active time tracking — start/stop per task (`PlayBtn`/`TimeFlag`), live ticking, persisted `trackedTime` with a 5min failsafe flush against accidental refresh/close. Switching tasks flushes and stops the old one, and settles it right below the new running task in the list instead of jumping back to its original position. The running task anchors the whole cascade off its own real remaining time, falling back to `now` once it runs over its own estimate. Covered by tests in `useTasks.test.js`. Full model/reasoning: `design/decisions.md`.
1. ✅ Sort finished tasks to bottom, collapsible section.
2. ✅ Edit task label/time via a popup modal — reasoning in `design/decisions.md`.
3. ✅ Time tracking MVP — ref: `design/day-planning.md` sketch 1e. Real-time start/stop, live display, switching, and the failsafe: done (above).
   - ✅ 2026-08-08: edit modal reflects time-tracking fields (below) — which also covers the "focus mode" idea from 2026-08-01 
   - ✅ 2026-08-01: starting tracking on an inactive task now also sets it `active`; parking the running task via the edit modal now also stops tracking; `sortedActiveTasks` falls back gracefully if `runningTaskId` ever points at a task outside `activeTasks`.
   - ✅ 2026-08-01: legacy finished tasks missing `finishedTimestamp` no longer poison `baseTime` — invalid timestamps are filtered out of the `Math.max` instead of trusting every record has one. Hit live on the deployed site, fixed and pushed same day.
   - ✅ 2026-08-01: pausing the running task now stays at the top instead of dropping back to its stored position — `stopTracking()` persists the same front-of-list reorder `startTracking()`'s switch already did.
- ✅ 2026-08-04: History page (`useHistory.js`, `/history` route) — finished tasks archive into a separate `history` localStorage entry (grouped by day, newest first) so they survive deletion from the active task list. Hooked into `toggleDone`, not deletion: a task enters history the moment it's marked done, leaves again if un-done.
- ✅ 2026-08-04: fixed the timer stopping on in-app navigation — `useTasks()` was only mounted inside `Tasklist.jsx` (route `/`), so switching to `/history` or `/project` unmounted it and killed `runningTaskId`/the interval. Lifted the hook into a single `TasksProvider`/`TasksContext` instantiation wrapping the whole app in `App.jsx`, consumed via `useContext` instead of per-page hook calls.
- ✅ 2026-08-04: `FloatingTaskPanel.jsx` — a draggable (Pointer Events), position-persisted mini panel mirroring the currently-tracked task on every page except Home. Uses a new view-only `TaskItemViewOnly` variant (label + `TimeFlag` + play/pause only, no edit/delete) exported alongside `TaskItem`.
- ✅ 2026-08-07: `formatTime` renders `1h` / `1h 30m` — whole hours used to emit a trailing space. This fixed the two tests that had been failing on every run for weeks; the suite is fully green again, which matters more than the formatting itself (a permanently-red suite trains you to ignore it).
- ✅ 2026-08-08: time tracking in the edit modal — live tracked time, play/pause, progress bar (glow once past planned). Editable in minutes while stopped; while running the input swaps to a read-only display, so a typed value can't collide with the 5min flush. Transforms moved from `TimeFlag` into `formatTime.js`; modal gets the whole `taskActions` bundle now. Shift+Enter = newline in the label.
- ✅ 2026-08-08: fixed the tracking hiccup (seconds stalled, then jumped by 2 — seen live). `setInterval(…, 1000)` drifts across the second boundary until one second never renders; now a self-rescheduling `setTimeout` aimed at the next boundary. Display-only, the value was always correct.
- ✅ 2026-08-08: unit cleanup — new `effectiveMinutes()` holds the "tracked time, or the estimate below 1min" rule that used to be written out four times with two different thresholds. `secondsToMinutes`/`minutesToSeconds` everywhere instead of hand-rolled `/60`. Plus the eight bugs from the modal review; details in `_Today.md`.
- ✅ 2026-08-08: tests now gate the deploy — `build` runs `vitest run` first, so a red suite means Vercel keeps the last working version live. GitHub Actions runs lint + tests on every branch as the early warning. Caught a real failure the same evening (`@testing-library/dom` is a peer dep since RTL v16 and wasn't declared).
- ✅ 2026-08-09: `LabeledField` replaces the modal's inline input/badge swap — one component, `viewOnly` renders the value as a read-only badge on identical box metrics, so nothing shifts when the timer starts. `slim` variant on `Input`; both share their padding via `inputStyles.js`. First component tests in the project (`TimeFlag.test.jsx`).
- ✅ 2026-08-09: running task shows in the browser tab (`useTabTitle.js`, `▴ 5:05 · label`), so a backgrounded Wren still says a timer is going. Rides on the existing per-second render, no second timer.
- ✅ 2026-08-09: the ticking clock stopped jittering. `tabular-nums` alone did nothing — Quicksand has no tabular figures — so live numbers get a `.tnum` class that switches them to Nunito (Inter loaded as the fallback). `TimeFlag` widened to `w-24` for three-digit minutes.

### 🟡 Phase 3 — Drag-and-drop
Split out from Phase 2 (2026-08-06) so it stops being a perpetually-deferred "step 4" of something else.
- ✅ 2026-08-09: day list reorders by drag via `dnd-kit`. Order stays "array order in `taskList`" — no `order` field, no migration; the whole translation between a page's filtered slice and the stored array lives in one pure `utils/reorderTasks.js` (13 tests). `DndContext` sits on the *page* (`TaskDndArea.jsx`), `SortableContext` per `TaskGroup`, because a drag can only cross lists inside one shared context.
- ✅ 2026-08-09: the running task is pinned and undraggable — it renders as its own one-item group outside the drag area, so it never receives a transform. Whole-row dragging with an 8px threshold keeps the click-to-open-modal behaviour intact.
- ✅ 2026-08-09: dragging *between* lists. A drop on another list rewrites `list`/`bucket` (keeping `activationDate`), and `onDragOver` applies it mid-drag so the target opens a gap instead of the task teleporting on release. `DragOverlay` floats a copy under the cursor; lists that can't take a live move show a dashed placeholder instead. Both source and target list outline while dragging.
- ✅ 2026-08-09: dropping onto Finished ticks a task off, dragging one out un-ticks it. Routed through `toggleDone` rather than a list change, so the timestamp and history entry still happen — `reorderTasks` refuses the `done` transition itself for exactly that reason.
- ✅ 2026-08-10: unplanned refactor — every list change now routes through a single `moveTaskToList`, with the per-list enter/leave rules in a pure `utils/taskTransitions.js`, so a future state adds a block instead of editing existing ones ("damit man die zwei funcs gezielt angreifen kann… vor allem mit potentiell mehr states in der zukunft"). Fixed the bug that prompted it — un-doning a task via the edit panel's active badge or the play button kept its `finishedTimestamp` and history entry, since only `toggleDone` knew the rules — plus a flush race that dropped tracked seconds when a running task was finished or parked. `useTasks.js` went 377 → 187 lines along the way: `useTimeTracking.js`, `useTaskRollover.js` and a pure `taskEstimates.js` split out of it, +21 tests.
- ✅ 2026-08-10: drop zones — `TaskDropZone` registers a whole section as one target and frames it, wrapping the header so a *collapsed* list stays droppable without opening. Empty lists render anyway: anything that changes size at drag start invalidates the position dnd-kit measured and leaves the preview hanging off the cursor. Auto-expanding collapsed sections was tried and rejected ("its super confusing and disorienting" — losing your scroll position mid-drag).
- ✅ 2026-08-10: Backlog page drags — one `TaskGroup` per bucket in its own drop zone, replacing one `TaskGroup` per task and the ▲/▼ shift arrows. Needed no new logic, only page wiring; the cross-bucket rewrite was already there and tested.
- 🟥 Open, the last one: live gap vs. dashed placeholder everywhere. Both are live on purpose right now — Tasklist without the live move, Backlog with it — so the feel can be compared on the same data. One prop switches it.

### 🟡 Break Tracking
- ✅ 2026-08-13: floating Pause Panel (`PausePanel.jsx`, mirrors `FloatingTaskPanel`) — start/stop a break by type (🍵 break, 🎮 gaming, 🫂 social by default), each with its own running total for the day; break time rolls into History alongside task time.
- ✅ 2026-08-13/14: break and task tracking split into dedicated contexts (`BreaksProvider`, `HistoryProvider`), with start/stop for both routed through one coordinated layer (`useTrackingContext`) that keeps "only one thing runs at a time" true across tasks *and* breaks.
- ✅ 2026-08-14: break types are fully optional now — the default 'break' type is no longer forced on. Disabling every type removes the whole panel (no timer, no icon); disabling the type a break is currently running under stops it automatically instead of leaving it ticking unseen.
- ✅ 2026-08-14: the minimized panel's emoji toggles the running (or last-used) break type directly, instead of only being able to stop one already running.
- 🔷 Next: a configurable duration per break, with overflow into a red state + sound — mirrors the task time-estimate alert. Presets discussed ("[5] [15] [45] [✎]", no required ∞ slot — no selection *is* unlimited), overflow behaviour intentionally scoped down for v1 (no `+5min` extend, no repeating alert). Not built yet.

### PUSHED UP: Habits/Recurring MVP

### Trello integration cont.
- move cards
- transform to tasks

### 🔷 Phase 4 — Dark mode
Pulled forward out of Phase 14's shell restyle (2026-08-06) — waiting until then risks every component built in between (Areas, gamification tab) needing dark-mode styling retrofitted later, which compounds into real pain. Design system already spec'd dual-theme via `[data-theme]` (see Design system section above); this phase is just wiring it up app-wide, not new design work.
- 🔷 Implement the `[data-theme]` dark variant across existing components using the tokens already defined in the design system import.
- Toggle control — placement TBD, likely lands alongside Phase 14's shell restyle.

### 🔷 Phase 5 — Areas
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

`area` (life-balance.md) needs to actually exist as a task field. Turned out to be a shared prerequisite for two different threads at once — life-balance's week/area tracking, and the gamification concept's stat system (task → area → stat, via the activity→stat mapping table in `design/wren-idle-konzept.md`) — so it earned its own phase rather than staying an unscheduled aside. (dependency reasoning, 2026-07-27: build areas *before* wiring anything directly task→stat, or it'd need a redesign once areas land anyway.)
- 🟥 Open: `area` tag itself, archive-instead-of-delete — see `design/life-balance.md`.

### Phase 6 — Simple Export/Import
Inbetween Broswerstorage and real Database, there is a need to save the json and being able to import it again 

### Project MVP

### 🟡 Phase 7 — Recurring Tasks / Habits & Reflection
- ✅ 2026-08-10: daily recurring tasks. A finished recurring task is *copied* into a new one on rollover rather than resurrected, so yesterday's completion keeps its tracked time and its history entry. `recurring.id` is the habit, the task id is one occurrence; `recurring.count` is incremented by `listRules[DONE]`, so it counts completions and un-ticking takes one back. Deleting can't end a habit by accident — every delete path replaces a habit whose last task is in the batch, and deleting an *unfinished* one asks first (with "park for tomorrow" as the third option).
- ✅ 2026-08-10: task ids are `crypto.randomUUID()`. `Math.max + 1` reused the ids of deleted tasks while history keeps them forever, so a new task could inherit an old one's archive — which daily habit copies would have made routine.
- 🟥 Open: two ways to pause a habit now exist (`recurring.active: false`, or parking it in a bucket). Both are correct; the recurring page needs to show both or a stalled habit is unexplainable.
- Only `frame: 'day'` is handled — `week`/`month` drop into the same field when this phase proper gets built.
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


### Phase 8 — Gamification MVP: character tab, no art
The smallest possible slice of `design/wren-idle-konzept.md`, deliberately scoped as a real hypothesis test, not a commitment to the full system: "do I actually look forward to opening Wren tomorrow morning?" Only after Phase 5 (Areas), per the dependency above.
- A character tab showing EXP per stat (INT/STR/AGI/VIT/DEX/LUK), computed from completed tasks' areas via the activity→stat table. No sprite, no art, no night/expedition loop yet.
- The full idle-game vision (day/night loop, dungeon expeditions, narrative, pets, bosses, sprites/outfits, collections) stays exactly where `design/wren-idle-konzept.md` sequences it (its Phase 2–4) — explicitly *not* pulled forward. That's real scope, comparable to everything else in this roadmap combined; building it now would repeat the "perfect one thing, everything else dies" pattern this whole roadmap exists to counter.

### Phase 9 — Subtasks, Tasks extendet
- tasks can hold subtasks with own est time, this will overwrite the task est time and acc the subtask leftTime instead 
- task can be split if user can only handle x subtasks for the day into a new bundle for tomorrow or parking  
- tasks holds 'created date' 
	- can display how many days you've been procrastinating a task. this is ony true for tasks that are either in 'active' or 'parking', if a task is put into backlog this 'prcorastination days' resets on new planning
- ~~Move tasks from parking into backlog: (before i wasnt sure if i want backlog AND parking, but i think parking is more for the day itself, backlog is for long term planning and idea dumping)~~ — resolved 2026-08-05: parking *is* backlog now, `nextUp` bucket specifically (see Phase 12). No separate migration step needed.
	- Still open — offer re-evaluation:
		- is important?
		- has deadline? 
		- think about this in a month? (gets some kind of alert )
- natural time input parsing ("15m"/"1h" → minutes) for add + edit — time/date math is a spot Claude helps directly, not hints-only (see `feedback_workflow` memory).

### Phase 10 — Day Planning extendet
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

### Phase 11 — View different Days, pre planning
- Plan tomorrow
- view yesterday etc
- Weekview
- #later Week View, 
- #later Month View
- maybe a moment to reflect on statistics, minimum first as always 

### 🟡 Phase 12 — Parking / active tasks, more Task handling
- ✅ 2026-07-29: `active` field (defaults `true` on creation), toggle via edit modal or hover shortcuts (`a` activate, `p` park). `TaskGroup.jsx` extracted; parked tasks sit in their own collapsible section.
- ✅ 2026-08-05: Backlog MVP — new `/backlog` route. Task data model consolidated from independent `active`/`done` booleans into a single `list: 'active'|'done'|'backlog'` enum plus a `backlog: {bucket, activationDate}` object (buckets: `nextUp`/`nextWeek`/`someday`; `activationDate` reserved for future auto-activation, unused so far). Legacy tasks migrate to the new shape on load. The Daylist's inline preview (was `inactiveTasks`, now `nextUpTasks`) only shows the `nextUp` bucket; `nextWeek`/`someday` live exclusively on the Backlog page. New shared components: `TaskInput` (name+time entry, reused by both Daylist and Backlog) and `SwitchFlag` (click/right-click cycles through an options array — powers both the bucket picker on add and, now, the edit modal). Bucket reassignment ships two ways for now: quick-and-dirty ▲/▼ shift arrows per task on the Backlog page (index-bound, not drag-and-drop), and the same `SwitchFlag` bucket picker inside the edit modal once a task is parked.
- ✅ 2026-08-07: rollover automation — the day boundary is a configurable hour now (default 4am, picked as a time nobody's actually working) instead of midnight. Crossing it runs day actions: `nextUp` tasks auto-activate, treating that bucket as "for tomorrow", and finished tasks optionally auto-delete (safe because they're already archived in History). Both are individually switchable in settings. A new day also starts at the later of *now* and a configurable default start time, so planning at 08:00 still cascades estimates from 09:00 — with a manual reset for when reality diverges. Day logic lives in `useDayActions.js` (owns `startedAt`, the boundary check, the reset); what happens to *tasks* on rollover is passed in as `onRollover`, so task logic stays in `useTasks`. History groups by the same logical day, so a task finished at 02:00 still files under the previous day.
- ✅ 2026-08-07: list and bucket names moved to `utils/constants.js` — no raw `'backlog'`/`'nextUp'` strings left in the app code. Hover shortcuts extended and documented in `design/Shortcuts.md`: `b` parks (was `p`, renamed to match the backlog wording), `1`/`2`/`3` set buckets, `↓` pushes a task to the bottom, `space` toggles tracking.
- 🔷 Open: move the parked-tasks panel from above the active list to beside it (collapsible sidebar) — the original ask, deferred since the MVP works without it.
- #taskSplitting split longer tasks into smaller sections, allowing the user to move those into the next x days or into the parking area 
	- could have functions like: split this `4h tasks` into `4 bites` and schedule them for the next `4 days` 
- ~~#question should there be a different 'backlock' for tasks that are not yet 'in the queue' but rather long term planning eg `next week, next month etc` BUT those should be suggested when actual time passes, unlike sunsama where this doesnt really mean anything.~~ — answered 2026-08-05: yes, that's the Backlog MVP above (`nextWeek`/`someday` buckets). The "suggested when time actually passes" part is what `activationDate` is reserved for — not wired up yet.

### Phase 13 — Projects MVP (timing not decided)
A first, deliberately simpler version of "projects" than the original fuller design idea. A real pain point — this was the whole reason the last redesign attempt started — but explicitly acknowledged as not a small session. Revisit *when*, together, once Phases 2–12 give a better sense of how tasks and projects should actually connect (see `design/life-balance.md`'s "project-related tasks" type).

### Phase 14 — Shell layout alignment
Restyle `Sidebar.jsx` / project view shell to match the `ui_kits/app` mockups (nav treatment, logo lockup). Dark theming itself is Phase 4 now — this phase just needs the toggle control once that lands.

### Phase 15 — First mini-app migration
Pick one reference app to fully migrate as a proof of the pattern — likely a simple day-planning one (`tagesliste.html` or `dayplan-picnic.html`) since that's closest to the Tasklist. Delete the source file once done.
#### SubPhase — Trackers & curricula migration
Work through the habit-tracker group, then the goals/curricula group, one at a time, each ending in a delete-the-reference-file step. Order to be decided together based on what's actually slowing you down day-to-day right now.

### Phase 16 — Long Term Planning
- plan week
- plan month
- plan quarter
- plan year
- the idea is mostly to have some overview over different goals and how realistic they are 
	- interesting balancing challenge: could a single project have meaningful goals for each step? eg 'comic' yeargoal 100pages, quarter 25 pages etc. could be displayed in the current project progress as well as the planning view 
	- are things on track? should things be re-evaluated? 

### 🟡 Phase 17 — User Settings
- ✅ 2026-08-07: settings page exists (`/settings`, deliberately understated link at the bottom of the sidebar). `useSettings` for the reactive page, plus a plain `loadSettings()` for the three call sites that read settings from effects/callbacks and therefore can't use a hook. Live so far: rollover hour, default start time, auto-activate `nextUp`, auto-delete finished.
- ✅ 2026-08-13/14: sound settings — a `timerSound` (plays when a running task passes its time estimate) and a fixed `finishedSound` for completed tasks, each independently on/off, plus one `soundVolume` applied everywhere a sound plays. Sounds are real audio files under `assets/sounds/`, catalogued via `utils/sounds.js` (`import.meta.glob`) rather than synthesized tones. `SoundPickerRow` (select + preview button, optional enable checkbox) is shared between the timer-sound picker and the finished-sound toggle — built to take a break sound too once that exists.
- With more tabs and functionality potential, there is a real need to have tabs/features optional for a user
- small settings too like tracking behaviour, default sort etc

### Phase 18 — In-app roadmap view (revised 2026-07-27)
Originally: recreate this roadmap as a Wren project object and retire this file. Reconsidered — (once planning data lives only in Wren's own storage, Claude can't read or co-edit it directly the way a repo file works in conversation), which breaks the actual point of a *shared, collaborative* roadmap. **`ROADMAP.md` stays the canonical planning doc indefinitely**, regardless of anything else built in Wren itself. If an in-app view ever makes sense, it should be a display/mirror generated from this file, not a replacement that retires it.

### Unsorted Micro Tasks
 - `KeyboardSensor` for mouse-free reordering (moved out of Phase 3, 2026-08-10). Not blocked on code — it claims Space/Enter on a focused row and Space is already start/stop tracking, which stays.
 - Fill-up progress bar for the running task's own card, not just the modal.
   - Rename `time` → `timeLeft` once the data model needs to distinguish planned time from remaining time.
   - `TimeFlagTracking` has been unused since `LabeledField` took over the modal badge (2026-08-09) — kept for now, drop it if nothing claims it.

## Future ideas (captured, not scheduled)
- **Focus modes:** a day/week "focus" setting (work, habits, balance, catch-up-on-neglected-things, procrastination-support) that changes *how* lists/plans are displayed — while all the underlying metadata of what was actually worked on that day is still tracked regardless of focus. Needs real design thought once there's more than one list type to reflow (post Phase 12). Concrete design exploration for the day-vs-tasklist split now exists — see `design/day-planning.md`; task-type taxonomy (recurring, growing-habit, project-linked) and the week-vs-day balance framing live in `design/life-balance.md`.
- **Focus session in the task modal** (2026-08-09, not to be confused with the "focus modes" bullet above — that one is about list display). The modal already *is* the focus view: open it, the timer runs, one task in front of you. Two ideas on top:
	- Maximise it. The window chrome in `Modal.jsx` already draws `_ □ ×` and only `×` does anything, so the affordance exists. Making `□` swap the width is ten lines — the real work is deciding what a big version *shows* (timer and bar large, the rest smaller), which is a second layout, not a scaled one.
	- `_` minimises into the `FloatingTaskPanel`. Breaks the current rule that the panel doesn't appear on the task page, but "minimise the window and it becomes the little floating one" is worth the exception.
	- 🟥 Open question, no answer yet: what makes the focus mode actually *get used*? A progress bar toward the estimate can only ever run out — something that accumulates instead would fit the gamification concept's day axis (`wren-idle-konzept.md`: day = EXP & stats, night = expedition). Design constraint if EXP ever derives from tracked time: the modal lets you type a tracked value by hand, so it would need to come from actually-ticked seconds, or hand-editing becomes a cheat button.
- **ManicTime import:** ManicTime does automated time tracking already. Eventually importing that data would let Wren compare planned vs. actual time use. Not urgent — revisit once Daylist/planning data actually exists to compare against.
- **Backend/database:** decision already made (not scheduled) — Python + FastAPI + SQLite, chosen deliberately over a hosted option for the learning/career value. Full reasoning and open questions in `design/data-architecture.md`. Realistically relevant around Phase 12–13, not before.
- **Books tab:** reading as its own feature area (to-read stack, page goals, day-list "continue this book" nudges, reading stats) — see `design/books.md`. Likely successor to `bookstack.html` in `references/`.
- **Full idle-game system:** everything beyond Phase 8's character-tab slice — day/night loop, dungeon expeditions, AI-generated narrative, collections, pets, bosses, Ragnarok-inspired class unlocks, character sprites/outfits — see `design/wren-idle-konzept.md` for the full concept and its own internal phasing. Real scope, intentionally not pulled into this roadmap's numbered phases yet.
- **Text-paste task parser (2026-07-28):** paste a block of free-flowing text, Wren parses discrete tasks out of it. (Framing: "nice to have but it would be REALLY nice to have.") Directly serves an existing workflow — sorting scattered thoughts into structured plans via Claude constantly (this whole roadmap is evidence of that pattern), so this would be automating something already proven useful by hand. Natural fit once the Python/FastAPI backend (`design/data-architecture.md`) exists — paste text → LLM call → structured tasks. Not scheduled.
- **ADHD Hyperfocus tracking** eg: 'you usually keep up with a habit for x days'
  the idea behind this is not to shame but to show the reality of living with adhd and find some self reflection, maybe even making it easier to accept that interests come and go in bursts. it's ok to retire habits, it's ok to get them back up. what makes you happy in what phase of your life? 
- **Trello board as a Wren page (2026-08-07, partly built).** Stopgap until real coworking exists — the point is "alles an einem Platz": see the shared board's state without leaving Wren. Lives in `src/pages/trello/` + `src/utils/trello.js` + `useTrelloBoard.js`. Already working: read-only board view (one call returns all lists with their cards nested) and creating a card per list. Auth is API key (shared, it's the app identity, not a secret) + a personal token per person via `trello.com/1/authorize` — nobody shares a token, since one token covers *all* of that person's boards. No backend needed; Trello's API allows CORS. Writes reload the board instead of updating optimistically — one cheap call, and it keeps other people's edits visible. Wishlist, deliberately parked as distraction ("ich glaub das waere grade ablenkung"):
	- Checkbox per card; ticking it moves the card into the `✅ Finished` list.
	- Move cards between lists via ▲/▼ arrows — same stopgap pattern the Backlog page already uses, since there's still no drag-and-drop.
	- **Transform a Trello card into a real Wren task** ("richtig nice und eigentlich auch fire fuer langzeit integration"). Finishing the Wren task also completes the Trello card. Transformed cards get a slightly different colour and land in `📌 In Progress` or `➡️ Next Up` depending on whether they went to the Daylist or the Backlog. Needs a link field on the task (`trelloCardId`) — new task fields must tolerate legacy localStorage records that lack them. This is the one that makes the integration more than a viewer.
	- Note: the first two are the same primitive — a `moveCard(cardId, targetListId)` call. Build it once and both fall out of it.
	- **Sync direction — decided 2026-08-07: ownership by label, not real two-way sync.** A card transformed into a Wren task gets a `wren` label in Trello, and the rule is that nobody edits those cards inside Trello ("ich weiss das ich die innerhalb der trello liste nicht anfasse"). Workable because the board has few people on it and it can just be communicated. This removes the expensive half of bidirectional sync — two sides changing one card and needing a winner — and leaves: Trello → Wren for everything unlabelled (already free on reload), Wren → Trello for labelled cards only (one-way, no conflicts). The label also makes the rule visible *in the board*, so the others read it off the card instead of having to remember an agreement. Remaining edge case, worth one `if` and not a system: someone archives or moves a labelled card anyway — on reload, treat a missing or `closed` card as "task unlinked" rather than erroring.

### 


## Open questions (revisit together)
- `sporteinheiten-tracker.html` vs `-v2.html` — same thing, keep only v2?
- Any of the 17 reference apps already dead/unused and safe to just delete now rather than migrate?
- How easy would it be to extract a desktop version of Wren? 
