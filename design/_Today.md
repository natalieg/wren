

## ▶ NOW: DnD (Phase 3)
*🤖 The Tasklist is done and pushed (branch `dragnAndDrop`, 0.6.0): reorder, drag between active/Next up/Finished, live gap, floating preview, dashed placeholder. What's below is what's actually left — finished items deleted, not archived.*

### 🤖 Step D — drop zones (next, ~1 session)
*the last structural piece. One change closes all three of these at once: a container droppable per list, so a list is a target even with nothing in it.*
- [ ] with no active tasks, nothing can be dropped into the day list — the group renders a zero-height div
- [ ] collapsed lists: `CollapsableDiv` collapses with `grid-template-rows: 0fr` and does **not** unmount, so its tasks stay live drop targets at zero height. Dropping into a collapsed list is wanted ("sometimes i just want to have things out of my field of vision"), it just has to be visible that it's happening.
- [ ] show Next up + Finished while a drag is running even when they're empty — "to show the user that they can do more than just sort the list, they can influence the state of the task"

### 🤖 Open, not blocking
- [ ] A/B the drag feel with friends before deciding: live gap vs. dashed ghost everywhere. Switch is one prop — comment out `onMoveAcrossLists` in `Tasklist.jsx` (marked `TEST` there).
- [ ] check: is the estimate cascade still correct right after a drag?
- [ ] `KeyboardSensor` → reorder without a mouse. Blocked on a decision, not on code: it grabs Space/Enter on a focused row and Space is start/stop tracking ("i would really like to keep space for tracking, i'm open for alternatives tho")

### Session 2 — Backlog
*cross-list moves already work — `reorderTasks` rewrites list/bucket on a drop into another group, and it's tested. This is Backlog-page work only.*
- [ ] 🤖 do first: `Backlog.jsx` wraps *every single task* in its own `TaskGroup` so the ▲/▼ buttons can sit beside it. A bucket can't be a sortable list that way — it needs one `TaskGroup` per bucket.
- [ ] remove the ▲/▼ arrows ("they were always just a sloppy solution as a bridge") — that collapses the block above to a few lines
- [ ] wrap the page in `TaskDndArea`, one `TaskGroup` per bucket

- [ ] simple div/ something playful like a coffee mug / in corner to click for 'take a break', this time is tracked seperately and vs the active time

## 🤖 Mini habit feature — daily recurring only (planned 2026-08-09)
*pulled forward out of Phase 7 deliberately, as a slice, not the phase. Do it on this branch **after** the DnD work is finished — sequential is fine, it was only parallel edits to `useTasks` that would have caused conflicts.*

**Scope: one sentence.** A task marked recurring that gets marked done comes back as active on the next rollover. Daily only — that keeps the rollover check to a single step, no date math.

- [ ] data model, bundled like `backlog` already is:
	- `recurring: { frame: 'day', every: 1 }`, or `undefined` when it isn't
	- same legacy-guard habit as everywhere else: `task.recurring?.frame`, never `task.recurring.frame`
	- `week`/`month` later drop into `frame` without touching the field
- [ ] `useTasks`: `reactivateRecurringTasks()` in the `onRollover` bundle
- [ ] UI: mark a task recurring (edit modal is the obvious place, `SwitchFlag` already does this kind of thing)

#### 🤖 two things that will bite
*decided 2026-08-09: rollover **copies** the finished task into a fresh one rather than resurrecting it — "i'm going to make another one just like that but with a new id, same name, same time estimate, and i'm going to leave your checked task alone". That alone kills the two nastiest traps: no time fields to reset, and no `toggleDone` round trip that would pull yesterday's completion back out of history.*
- [ ] **order still matters, for the opposite reason.** `onRollover` runs `promoteNextUpTasks()` → `deleteFinishedTasksOnRollover()`. The copy has to be made *before* the delete — not so the task survives, but so there's still something to copy from.
- [ ] **don't copy twice.** With `autoDeleteFinished` off, yesterday's finished recurring task is still sitting there tomorrow, and would be copied again every single day. Skip the copy when an unfinished task with the same `habitId` already exists.

#### 🤖 `habitId` — the field that makes copies a habit instead of look-alikes
- [ ] every copy carries the same `habitId`; the id on the *task* stays unique per occurrence
- [ ] it's what the duplicate guard above checks against
- [ ] Phase 7 wants "overview fail/success, growth over time" — that's a per-habit question, so without this it needs a migration later. One field now, a filter later.

#### 🤖 switch task ids to `crypto.randomUUID()` — do this first
- [ ] `Math.max(...taskList.map(t => t.id)) + 1` only looks at the *current* list, so deleting a task frees its id for reuse. With auto-delete-finished on rollover that recycling happens daily, while history keeps old ids forever — so a new task can inherit a dead one's archive entries.
- [ ] old numeric ids keep working, everything compares with `===`
- [ ] one catch, same step: `useTaskKeyboardShortcuts` does `Number(hovered.dataset.taskId)`, which breaks on string ids
- [ ] daily copies make many more tasks, which is what turns this from theoretical into likely

#### 🤖 pre-existing bug, worth fixing while in here
- [ ] `removeFromHistory(taskId)` filters the id out of **every** day, not just the current one — un-ticking a task deletes its earlier completions too. Fix: scope it to a day, `removeFromHistory(taskId, dayKey)`, reusing the `logicalDayString` `addToHistory` already uses.
	- [ ] copy-per-day dodges this (unique ids per occurrence), so it's a latent bug, not a blocker
	- [ ] no change needed to `addToHistory`: it groups by day and dedupes only *within* a day, which is already right

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
- [ ] autsplit tasks that had some tracking from the previous day on rollover 
- [ ] give tasks put on #nextWeek an activation date 7 days from now #later settings: should it automate to 'monday' or '7 days in future'



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
- if dashed line for every drag: **Yes — and it's genuinely one line.** Just don't pass `onMoveAcrossLists` to `TaskDndArea`. No live move means no list ever receives the real row, so the placeholder rule fires everywhere, and in-list sorting keeps its normal animation either way.

#### Integrate in Roadmap:

- [ ] Task Priorities 
	- [ ] set priority on task [1,2,3]
	- [ ] sort by priority
	- [ ] priority on projects
	- [ ] [tasks on projects?]


---

*🤖 = added by Claude, not by me*