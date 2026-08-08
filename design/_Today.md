## Task Modal 'Time Feature'
*synced to roadmap Phase 2, 2026-08-08 — only the open bits left here*
- [x] #editModal  edit "tracked" time / reset tracked time 
- [ ] - [ ] [[Time Tracking 260801]] ( MVP) 
	- [ ] '**popup modal**' could be an opportunity for a simple 'focus mode' 
		- [x] update time display [current/planned]
		- [x] add the 'track time' btn 
		- [x] make it possibel to edit the 'tracked time'
	- [x] for 'inactive Tasks' and maybe 'active' to style the 'estimate' time differently, or hide it completely, if the elapsed time is larger than planned 
	- [ ] numbers should not 'wobble' around while the tracker is running
		- [x] the seconds-hiccup (stall, then jump by 2) is fixed — ticks aim at the second boundary now
		- [ ] rest: does the width still jump when the digit count changes? tabular-nums / fixed width would fix that
- [ ] optimize styling of timefields in modal
- [ ] [space] should toggle tracking inside the modal too
	- [ ] heads up, not just "add a handler": `useTaskKeyboardShortcuts` bails out when focus is in an INPUT/TEXTAREA (line 22) and needs a hovered `[data-task-id]` element (line 25) — the modal has neither. And space *must* stay a space inside the textarea, so decide the rule first (e.g. only toggle when no field is focused)
- [ ] Bar should move on seconds too
- [ ] Labels for the input fields - maybe new component with label up top, input below
- [ ] Time general: can we have the running time in the tab header, so we know that a timer is active or is this not possible? or a massive work around? 

- [ ] sort finished tasks by timestamp
- [ ] show timestamps in history?
- [ ] keybinds change : 
	- [ ] **t** for **next up** [tomorrow] 
	- [ ] **w** for **next week**
	- [ ] **b** for **backlog**

## ✅ Open bugs — from the modal review 2026-08-08
- [x] 1. `trackedTime` is `undefined` on pre-tracking tasks → `undefined + 0` = NaN in `TaskEditModalBody` (lines 16, 68, 74). Shows "NaNm", warns on `value={NaN}`, gives `Bar` a `width: NaN%`. Everywhere else guards it as `(trackedTime || 0)`. Barely any such tasks left, but cheap to close
- [x] 2. the estimate fallback in `TimeFlag` is dead — it used to test a *number* (`0` falsy → fall back to the estimate), now it tests the *string* from `formatTimeWithSeconds`, and `"0"` is truthy. A finished task with no tracked time shows a bold "0" instead of its estimate. Test `tracked > 0` instead
- [x] 3. `Textarea` lost its background: `background` was removed from `.input` in index.css and replaced by the new `backgroundColor` prop on `Input` — `Textarea` uses the same class but not the prop. Invisible right now because it sits on white, still wants a fallback
- [x] 4. `formatTimeWithSeconds` is one shape now (`m:ss` throughout, no flip at the minute boundary); finished tasks go through `formatTime` for whole minutes
- [x] 5.`bg-red-200` / `bg-green-200` in the modal are raw Tailwind colours — the rest of the app runs on tokens. `--color-success` exists, a `--color-warning` doesn't yet ▶ **left open on purpose: needs a design decision on the warning colour, not a mechanical fix**
- [x] 6. `parseInt(minutesToSeconds(...))` argument order + the no-op `preventDefault`
- [x] 7. `Bar` sanitises `percent` itself now (NaN/Infinity → 0), and the planned-time input no longer writes NaN
- [x] 8. #small the 5min failsafe flush drops the part-second (`Math.floor` + baseline reset to `Date.now()`) — up to 1s lost per flush. Cosmetic, one line: offset the new baseline by the remainder

### Unit consistency pass — done 2026-08-08
*`/60` and `*60` were scattered over 8 places, and the "tracked time, or the estimate below 1min" rule was written out 4× with two different thresholds.*
- [x] new `effectiveMinutes(trackedSeconds, estimateMinutes)` in `utils/formatTime.js` — the rule lives in exactly one place now, unit-tested incl. the exactly-60s edge case
- [x] `TimeFlag`, `TimeProgress` and `History` (×2) call it instead of each having their own variant
- [x] `minutesToSeconds` in `useTasks` (×3) and the modal's `Bar` instead of hand-written `* 60`
- [x] `TrelloList` due dates go through `formatDate` — the only place still using the browser locale instead of de-DE
- [x] unused `formatTime` import in `TaskItem` removed
- [ ] deliberately untouched: `5 * 60 * 1000` etc. in `useTasks`/`Settings`/`rollover` — millisecond durations, different domain

## DnD mini-roadmap (Phase 3) — planned 2026-08-08
*two sessions. the data model is already done: order = array order in `taskList`, persisted as-is. no `order` field, no sort index, no migration. `pushToBottom` is already a reorder — DnD only changes **which** index gets written.*

### Decide first (5 min, before any code)
- [ ] what happens to `sortedActiveTasks()` while tracking? it pulls the running task to the top, so dragging something above it snaps back
	- [ ] option A: keep it, running task is simply not draggable / always pinned
	- [ ] option B: pin only until the first manual drag, then respect manual order
	- [ ] the `// LATER should be changable in user settings` comment on [useTasks.js:282] is exactly this decision
- [ ] drag handle or whole row? whole row = nicer, but conflicts with the row's `onClick` → modal (solvable, see step 5)

### Session 1 — Tasklist
- [ ] `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] `utils/reorderTasks.js`: pure `reorderTasks(taskList, activeId, overId)` → new array
	- [ ] **the actual brain-work step.** the page renders `openTasks` (filtered + derived), DnD reports "A over B" in *that* list — both ids have to be found in the full `taskList` and spliced there
	- [ ] pure function = unit-testable without any DnD. tests: move down, move up, unknown id, tasks of other lists keep their relative position
- [ ] wire into `useTasks` as `reorderTask(activeId, overId)` → `setTaskList(reorderTasks(...))`, add to the `taskActions` bundle
	- [ ] no other change in `useTasks` needed — `openTasks`/estimates are derived and recompute on their own
- [ ] `TaskGroup.jsx`: wrap in `DndContext` + `SortableContext` (`verticalListSortingStrategy`), `onDragEnd` calls `reorderTask`
- [ ] `TaskItem.jsx`: `useSortable({ id })`, apply `transform`/`transition` to the wrapper
- [ ] fix drag vs click: `PointerSensor` with `activationConstraint: { distance: 8 }` — below 8px it stays a click and opens the modal
	- [ ] check Checkbox / PlayBtn / ✕ still work (PlayBtn already does `stopPropagation`)
- [ ] `DragOverlay` for the floating preview while dragging
- [ ] bonus, nearly free with dnd-kit: `KeyboardSensor` → reorder without a mouse
- [ ] check: is the estimate cascade correct after a drag? and does it still persist after F5?

### Session 2 — Backlog
- [ ] within a bucket first — same pattern, `backlogTasks` is filtered by bucket per group
- [ ] only then across buckets: that's reorder **and** a `bucket` field change in one drop. this is the part that makes it two sessions instead of one
- [ ] decide: do the ▲/▼ arrows stay as a keyboard/touch fallback, or go?

### Explicitly NOT in this phase
- [ ] real `priority: 1|2|3` field — different feature (sortable, filterable). manual order already *is* the priority in Wren, DnD doesn't produce a priority field
- [ ] dragging across pages (Tasklist ↔ Backlog)

## Trello integration
- [ ] trello task abhaken, 
	- [ ] karte bekommt checkbox, 
	- [ ] beim abhaken landet es direkt in 'finished' -
- [ ] trello karte zu einem 'wren task' transformieren. 
	- [ ] wenn ich den abschliesse, beende ich auch die trello karte (abhaken) 
	- [ ] verwandelte karten koennten leicht anders gefaerbt sein und 
	- [ ] sollten in 'in progress/nextup' sein, je nacheem ob backlog oder 'active'  
- [ ] karten verschieben ueber pfeile, ich hab immerhin immernoch kein dnd xD,,

## rest

- [ ] settings: default task time
- [ ] duplicate task with [d] > bonus: add number to duplication [eg task2 if task was doubled], ideally it can count up numbering or add [1] at the end
- [ ] "Activate All" for the parking area
- [ ] [Badge] sum of parked items
- [ ] DND
- [ ] #rollover backlog 'next week' items: 
	- [ ] when a task is set to 'next week' it gets an 'activation date' (default 7 days from now, if the task is created on monday, it will activate next monday)
	- [ ] activation date can be edited in modal 
	- [ ] #later user can set in #settings what the default behaviour is 
- [ ] delete tasks from #history
- [ ] delete whole entry from #history 

![[Pasted image 20260727211428.png]]

## Soon:
- [ ] MVP #Project 
	- [ ] 1. Name, Time, Value [current, goal], Deadline
		- [ ] once deadline is set: calc how many [value] per day
	- [ ] Split task from project, most simple way - 'grab x minutes from project -> Tasklist'
		- [ ] maybe #later get "task" extraction in connection to deadline eg: deadline dictates that i should do 10 pages every day - extract standart task of '10 pages' or '+' task with 15 pages (could be boosted with percentile logic)
		- [ ] alt: define 'standart task' to extract eg 'standart task for this project is 10 pages for 2h', when the task is marked 'done' on the tasklist, the user gets a popup to confirm the output, the new sum is added to the project (or updated, depending if this is an accumulative goal or not)
	- [ ] custom unit - unit per hour / hour per unit whatever way is better
- [ ] bar on taskitem or 
- [ ] mini gamification: 
	- [ ] collect coins for each x that you not started gaming that day *or paused gaming* 
	- [ ] 'buy' gaming time from a repdefined pool of time 
	- [ ] 'gaming cards' are visible on the list but other color `eg red`
- [ ] optional: 'rest time' bar, shows the time between tasks, can be connected to a thing 'eg, gaming, procrastinating, talking etc' or a task (the task will then either be created or gets the time that passed)


## Later/Thoughts/sortme:

- [ ] #small Sort last checked task to top
	- [ ] give tasks a [finishedTimestamp], sort by that. this timestamp is need in the future anyway
- [ ]  #sidepanel #parking space evaluate if  could be at the side of the main list, collapsable, maybe dragging tasks into today but also with shortcut, maybe right arrow -> (if parking is left lol)
- [ ] real time log per task, right now the tracked time is just accumulated, muddying the 'real' tracked time per day
- [ ] soft 'deadline' per task for the day, can be useful to keep track if tasks are handled in the right time slot. indication could be:
	- goal: 13:00
	- until 1h left: estimate finish time is green
	- until 30min left: orange/yellow
	- goaltime is over: red
- #Project task shapes:
	- example: for projects, the shape is always the same. goal are x pages, each page needs:
		- rough sketch
		- clean sketch
		- lineart
		- color
		- finish
		- export ... etc
	- so it would be great if we could create a 'template' for each project (also save those in a library for later use, eg for other comics?)
	- the user can display both modes, reasoning: some artists like to work page to page, eg webtoon artists, print artists might prefer the 'all rough sketches first' etc
		- both displays always available:
			- display could be every page as master task, with ⬜⬜⬜ boxes/dots displaying the progress for each page
			- OR every step as a master task with same progress ⬜⬜⬜ etc 
			- benefit: user can always see the progress of the whole pages/phase
			- usability: next box is only unlocked if the prev phase is finished, this could also be set as conditional/nonconditional in the template (eg, pages are not really force connected, while linearts always need sketches first, tho usually one works linear, but sometimes it happens that one is able to finish page 20 before they finish page 19)

#### Integrate in Roadmap:

- [ ] Task Priorities 
	- [ ] set priority on task [1,2,3]
	- [ ] sort by priority
	- [ ] priority on projects
	- [ ] [tasks on projects?]