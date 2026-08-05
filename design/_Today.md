
## backlog v 0.3.0
- [x] #design polish current 'next up/etc' flag in #editModal
- [x] change 'MultiSwitchFlag' with keys <- and -> should be able to trigger those when [active] but also [mouseOver] 
- [x] change task bucket with [mouseOver] and num key, correlating to bucket number (1 to 0, 2 to 1 etc)
- [ ] decision: should task modal stay open, when backlog task is set 'active'? currently closing because this task no longer exists in backlog, but could be confusing. this could be some exception state
## rest

- [ ] change time in history if minutes are bigger than 60
- [ ] #editModal  edit "tracked" time / reset tracked time 
- [ ] "Activate All" for the parking area
- [ ] [Badge] sum of parked items
- [x] #Bug multi action 'b' only parks one item because the 'mouseOver' event doesnt fire if the mouse 'stays' in the same position after one task is transfered to the parking area — fixed by resolving the hovered task via `elementFromPoint` at keydown time instead of cached hover state, see [[_Shortcuts]]
- [ ] [[Time Tracking 260801]] ( MVP) 
	- [x] shortcut [space] to toggle active timer (same behaviour, only activate when mouse over)
	- [ ] '**popup modal**' could be an opportunity for a simple 'focus mode'
		- [ ] update time display [current/planned]
		- [ ] add the 'track time' btn 
		- [ ] make it possibel to edit the 'tracked time'
	- [ ] for 'inactive Tasks' and maybe 'active' to style the 'estimate' time differently, or hide it completely, if the elapsed time is larger than planned 
	- [ ] numbers should not 'wobble' around while the tracker is running
- [ ] DND
- [ ] first #rollover #automation : 'next up' should become active after planned time, 'finishedTask' autodelete (its ok now that they have the history page)
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


## Later:

- [ ] #small Sort last checked task to top
	- [ ] give tasks a [finishedTimestamp], sort by that. this timestamp is need in the future anyway
- [ ]  #sidepanel #parking space evaluate if  could be at the side of the main list, collapsable, maybe dragging tasks into today but also with shortcut, maybe right arrow -> (if parking is left lol)

#### Integrate in Roadmap:

- [ ] Task Priorities 
	- [ ] set priority on task [1,2,3]
	- [ ] sort by priority
	- [ ] priority on projects
	- [ ] [tasks on projects?]