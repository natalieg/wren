
## 🤖 Unified Activity Refactor (`design/unified-activity-model.md`)

- [ ] 🤖 Phase 1 — add `sessions[]` alongside existing fields (tasks + breaks), don't remove `trackedTime`/`finishedTimestamp` yet
	- [ ] 🤖 `useTracker.js` records start/stop pairs
	- [ ] 🤖 `useBreakTracking.js` writes sessions alongside `breakDurations`
	- [ ] 🤖 `useTasks.js`/`useTimeTracking.js` writes sessions alongside `trackedTime`
- [ ] 🤖 Phase 2 — point reads at `sessions[]` instead of old fields, one consumer at a time
	- [ ] 🤖 tracked-time displays (`TimeFlag`, task modal, `PausePanel.jsx`)
	- [ ] 🤖 History views (`DayEntry.jsx`, `WeekOverview.jsx`, `weekStats.js`)
	- [ ] 🤖 `breakTimeByType` (`utils/breaks.js`)
- [ ] 🤖 Phase 3 — merge task + break storage into one `activities` array
	- [ ] 🤖 lock in the final `Activity` shape (kind, list, sessions, kind-specific fields)
	- [ ] 🤖 legacy adapter for old `tasks`/`breakDurations`/`history` localStorage keys
	- [ ] 🤖 merge `TasksProvider`/`BreaksProvider` into one store
- [ ] 🤖 Phase 4 — history becomes a derived filter over `activities`, not a stored duplicate
	- [ ] 🤖 delete `addToHistory`/`addBreakToHistory`/`removeFromHistory`
- [ ] 🤖 Phase 5 — delete legacy fields + adapters once nothing reads them
	- [ ] 🤖 drop `trackedTime`/`finishedTimestamp`/`breakDurations` key

- [ ] copy button in task modal 
	- [ ] also 'copy for tomorrow' - automatically in 'next up' (if i want to keep the synch active there, i need to tackle those that are parked as well)

- [x] 📌auto copy new 🟦 subtasks into copied task of the same name family (checkbox directly below notes) 
	- [x] mvp: one directional, better: check state etc, but maybe this is only possible for real subtasks?



- [ ] in settings: security 'track for max x hours of inactivity' for when the user forgets to close the app 
	- [ ] this should also gett a flag 'auto stopped' so its easily seen as something that was kept running

- [ ] sort finished tasks by timestamp
- [ ] show timestamps in history?
- [ ] keybinds change : 
	- [ ] **t** for **next up** [tomorrow] 
	- [ ] **w** for **next week**
	- [ ] **b** for **backlog**

- [ ] contextmenu for tasks (right now we have shortcuts but no communication about what those are)
- [ ] floating panel parken - **research** wie einfach ist das, die floating panels irgendwo reinsnappen zu lassen um sie zu 'parken' und mehr uebersicht zu schaffen?
	- [ ] floaters ein [x] geben, die 'gexten' panele koennten sich rechts/links an einer leiste sammeln, dort waeren sie quasi minimiert und man kann sie jederzeit zurueckholen bei bedarf
### Project MVP
- simple project with 
	- name
	- active 
	- deadline
	- current status: [50 pages]
	- goal [200 pages]
	- daily goal [20 pages] -> those could convert to a form of 'habit'
		- maybe also how many sessions? `4 -> 5p each session`
		- daily goal could auto calc from deadline, left to goal etc
		- setting, maybe #later : `possible daily goal states:`
			- push: do more in the beginning, recalc daily goal after x days/weeks 
			- medium: do realistic, a bit more to have a buffer to the deadline (eg, the 'real' goal of 20pages per day only works if there is never a sick day etc)
			- minimum: just do the minimum you need to 'survive' for the deadline, but this holds the risk of not meeting the deadline if user misses a day. calculates daily for best match 
			- do more during weekdays
			- work on special days etc
		- daily goal set by user could display a potential 'finished by' date vs deadline 
	- time per x `user decision: per page, or per daily goal?
	- probably #later  visual representation of progress, could be done by a graph that shows bars for each day in color good in time/ slacking
- Meta Information: shows how much time user needs for all goals that are currently active every day

- [ ] Show 'tracked time' on task in sessions - needs implementation of new 'session started/session ended' timestamps 
	  eg: [name] tracked time [20m]
	  session 1 --- [10m] at [1pm]
	  session 2 --- [10m] at [3pm]

## Trello integration
- [ ] trello task abhaken, 
	- [ ] karte bekommt checkbox, 
	- [ ] beim abhaken landet es direkt in 'finished' -
- [ ] trello karte zu einem 'wren task' transformieren. 
	- [ ] wenn ich den abschliesse, beende ich auch die trello karte (abhaken) 
	- [ ] verwandelte karten koennten leicht anders gefaerbt sein und 
	- [ ] sollten in 'in progress/nextup' sein, je nacheem ob backlog oder 'active'  
- [ ] karten verschieben ueber pfeile, ich hab immerhin immernoch kein dnd xD,,

## Task Modal 'Time Feature' — parked
- [ ] [[Time Tracking 260801]] ( MVP) 
- [ ] [space] should toggle tracking inside the modal too
	- [ ] 🤖 heads up, not just "add a handler": `useTaskKeyboardShortcuts` bails out when focus is in an INPUT/TEXTAREA (line 22) and needs a hovered `[data-task-id]` element (line 25) — the modal has neither. And space *must* stay a space inside the textarea, so decide the rule first (e.g. only toggle when no field is focused)
- [ ] 🤖 maximise the modal for a proper focus view — the `□` in the window chrome is still decoration. Details in the roadmap's Future ideas
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

 ### dedicated work area
- dedicated 'work' space, this is for one project only, concentrating on the tasks for that project alone, can be useful for stuff like client projects, to not be distracted by other things
- can have its own 'time for today' bar at the top, eg i want to work 5h on this project today 
- has its own pomo session timer
- can sort through tasks like the user would on the main page, with just project related tasks 
- list handling - helping the user to decide between different tasks (important, now, small etc)
- this could in the long run ween me from clickup if it has its own time tracking overview (weekview for this project, time entries can be edited, relate to tasks, also a field for free time entry if its general work on project without tracking a special task)

### reward systems
- reward for longer work sessions, or general stuff 
	- eg work has three steps 1h minimum, 4h median, 6-7h 👑
	- maybe there could be somthing that indicates which state is reached at this point
	- some collactibles as reward for long long sessions, reaching those special goals
- could be implemented for almost everything that has recurring needs, areas or projects


#### Integrate in Roadmap:

- [ ] Task Priorities 
	- [ ] set priority on task [1,2,3]
	- [ ] sort by priority
	- [ ] priority on projects
	- [ ] [tasks on projects?]

### small Reward Sotre (pre req some gamification, or its just every x tasks or every x minutes of productivity)
	- play meaningful game for 1h (costs 6 tasks)
	- one picross
	- painting (ohuhu)
	- read 4-6 pages of a TBR book 
- Store could also give 'random reward' or shelf to buy from
- in contact with the whole 'gaming issue' maybe taking money away but not sure how good this would feel, balancing is always a question
### Feature Question
what kind of feature can i implement that
- motivates me to do more 'real' things in the morning
- do exercises first thing
- do exercsies twice
- reduce gaming
- reward me for doing my tasks (especially work)

### GAMIFICATION

strong connection to ragnarok online but with a twist

once we have areas, those can double as 'skills' or influence stats rather
eg yoga gives int and vit
rorgramming int and dex and so on

you start as an acolyte, you can choose your next class once youre level 12 AND you have the according skills: eg
20int 
20dex for aco

20dex
20 agi for archer and so on

i can use the ragnarok skilltree for further class progressions
you can progress through multiple skill trees but only after rebirth and the second class costs more skill points or something

gaming, junkfood etc make the chara lose hp
when the hp is below 20, they cannot earn exp, effectively blocking the user until they change their behaviour 

maybe include sp for class related skills eg 
blessing from aco : make you earn 20% more exp
agi from archer: make you gain more 40% exp from exercise activities
x from dancer: more exp from art related and so on

### Wandering Subtasks

connected to workblock tasks like my 'work for 45 minutes'
right now, if i doublicate tasks they all get the same subtasks which already helps, and having the top tasks i want to tackle for a project is great

some thoughts: this could also be done in the main project page, that i pin the 'tasks for this week' that i evaluate each week new, unfinished tasks can stay or pushed down to the backlog / with another deadline 
tasks with a deadline for this week sort themselves automatically into the block

i think if i think of tasks as a bigger picture than just 'task' as to-do, timeblocks themselves are a valid 'task' that dont hold a certain todo themselves but are rather connected to a project or an area and are populated by the tasks that are related to that area. this could also solve the 'how to introduce pomodoro' to the project, as timeblocks themselves can behave like pomodoro workblocks

### Desi Testing
- active/deactive als toggle
- notes area mit enter nicht verlassen
- tooltips xD (vor allem im edit window)