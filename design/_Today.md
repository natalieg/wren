

## ▶ NOW: DnD (Phase 3)
*🤖 Time feature is parked below — 0.5.0 is merged and live, it can rest. Warm-up if needed: the keybind change further down (t/w/b), ~10 min.*

## 🤖 DnD mini-roadmap (Phase 3) — planned 2026-08-08
*two sessions. the data model is already done: order = array order in `taskList`, persisted as-is. no `order` field, no sort index, no migration. `pushToBottom` is already a reorder — DnD only changes **which** index gets written.*

### Decide first (5 min, before any code)
- [x] what happens to `sortedActiveTasks()` while tracking? it pulls the running task to the top, so dragging something above it snaps back
	- [x] option A: keep it, running task is simply not draggable / always pinned
	- [ ] option B: pin only until the first manual drag, then respect manual order
	- [ ] the `// LATER should be changable in user settings` comment on [useTasks.js:282] is exactly this decision
- [x] drag handle or whole row? whole row = nicer, but conflicts with the row's `onClick` → modal (solvable, see step 5)

### Session 1 — Tasklist
- [x] `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [x] `utils/reorderTasks.js`: pure `reorderTasks(taskList, activeId, overId)` → new array
	- [x] **the actual brain-work step.** the page renders `openTasks` (filtered + derived), DnD reports "A over B" in *that* list — both ids have to be found in the full `taskList` and spliced there
	- [x] pure function = unit-testable without any DnD. tests: move down, move up, unknown id, tasks of other lists keep their relative position
- [x] wire into `useTasks` as `reorderTask(activeId, overId)` → `setTaskList(reorderTasks(...))`, add to the `taskActions` bundle
	- [x] no other change in `useTasks` needed — `openTasks`/estimates are derived and recompute on their own
- [x] `TaskGroup.jsx`: `SortableContext` (`verticalListSortingStrategy`) — the `DndContext` went **one level up** instead, into `TaskDndArea.jsx` on the page ("i never want to write something 'just like this' to sort it out later"). Separate contexts can't drag between each other, so cross-bucket/habit drops need one shared context per page from the start.
- [x] `TaskItem.jsx`: `useSortable` lives in a `SortableTaskItem` wrapper; the pinned running task renders plain `TaskItem` and never touches dnd-kit
- [x] fix drag vs click: `PointerSensor` with `activationConstraint: { distance: 8 }` — below 8px it stays a click and opens the modal
	- [x] Checkbox / PlayBtn / ✕ / modal all still work
- [ ] `DragOverlay` for the floating preview while dragging
- [ ] bonus, nearly free with dnd-kit: `KeyboardSensor` → reorder without a mouse
	- [ ] 🤖 blocked on a decision, not on code: `KeyboardSensor` grabs Space/Enter on a focused row, and Space is already start/stop tracking ("i would really like to keep space for tracking, i'm open for alternatives tho")
- [x] persists after F5
- [ ] check: is the estimate cascade correct after a drag?

### 🤖 Next block — drop feedback (decided 2026-08-09, before session 2)
*this has to ship **before** cross-group drops, not after: today a drop on the wrong list is a silent no-op, but the same gesture becomes a real bucket move in session 2.*
- [ ] highlight the list currently being dragged onto ("that does help me a lot")
	- [ ] `TaskDndArea` tracks `over` via `onDragOver`, resolves its group with `groupKey` (needs a named export from `reorderTasks.js`), each `TaskGroup` compares against its own key
	- [ ] the same highlight explains the snap-back: no highlight = this drop does nothing
- [ ] container droppable per `TaskGroup`, so an empty or collapsed list is still a target
	- [ ] `CollapsableDiv` collapses with `grid-template-rows: 0fr`, it does **not** unmount — collapsed tasks are already live drop targets at zero height. Dropping into a collapsed list is wanted ("sometimes i just want to have things out of my field of vision"), it just needs to be visible that it's happening.
- [ ] `DragOverlay` belongs in this block too — it's the same "where will this land" problem

### 🤖 Layout: pin the running task above everything (started 2026-08-09)
- [x] running task renders as its own one-item group, outside `TaskDndArea` — can't be dragged, can't be dropped on
- [ ] it still sits *below* "Next up" visually; the pin only makes sense once it's above that too
- [ ] render-split only, never a data change — estimates, history and persistence all need it to stay an ordinary active task

### Session 2 — Backlog
- [ ] within a bucket first — same pattern, `backlogTasks` is filtered by bucket per group
- [ ] only then across buckets: that's reorder **and** a `bucket` field change in one drop. this is the part that makes it two sessions instead of one
	- [ ] 🤖 `reorderTasks` already *detects* this case — it returns unchanged when the two group keys differ. Filling that branch in moves zero existing lines.
- [x] decide: do the ▲/▼ arrows stay as a keyboard/touch fallback, or go? → **go** ("they were always just a sloppy solution as a bridge")
- [ ] 🤖 blocker to do first: `Backlog.jsx` wraps *every single task* in its own `TaskGroup` so the ▲/▼ buttons can sit beside it. A bucket can't be a sortable list that way — it needs one `TaskGroup` per bucket. Removing the arrows collapses that block to a few lines.

- [ ] simple div/ something playful like a coffee mug / in corner to click for 'take a break', this time is tracked seperately and vs the active time

## Task Modal 'Time Feature' — parked
*🤖 The MVP shipped in 0.5.0. What's left here is polish, nothing blocking.*
- [ ] [[Time Tracking 260801]] ( MVP) 
- [ ] [space] should toggle tracking inside the modal too
	- [ ] 🤖 heads up, not just "add a handler": `useTaskKeyboardShortcuts` bails out when focus is in an INPUT/TEXTAREA (line 22) and needs a hovered `[data-task-id]` element (line 25) — the modal has neither. And space *must* stay a space inside the textarea, so decide the rule first (e.g. only toggle when no field is focused)
- [ ] 🤖 maximise the modal for a proper focus view — the `□` in the window chrome is still decoration. Details in the roadmap's Future ideas

- [ ] sort finished tasks by timestamp
- [ ] show timestamps in history?
- [ ] keybinds change : 
	- [ ] **t** for **next up** [tomorrow] 
	- [ ] **w** for **next week**
	- [ ] **b** for **backlog**

- [ ] Show 'tracked time' on task in sessions - needs implementation of new 'session started/session ended' timestamps 

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


---

*🤖 = added by Claude, not by me*