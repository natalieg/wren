
- [ ] #design polish current 'next up/etc' flag in #editModal
- [ ] #editModal  edit "tracked" time
- [ ] "Activate All" for the parking area
- [ ] [Badge] sum of parked items
- [ ] #Bug multi action 'b' only parks one item because the 'mouseOver' event doesnt fire if the mouse 'stays' in the same position after one task is transfered to the parking area
- [ ] [[Time Tracking 260801]] ( MVP) 
	- [ ] shortcut [space] to toggle active timer (same behaviour, only activate when mouse over)
	- [ ] '**popup modal**' could be an opportunity for a simple 'focus mode'
		- [ ] update time display [current/planned]
		- [ ] add the 'track time' btn 
		- [ ] make it possibel to edit the 'tracked time'
	- [ ] for 'inactive Tasks' and maybe 'active' to style the 'estimate' time differently, or hide it completely, if the elapsed time is larger than planned 
	- [ ] numbers should not 'wobble' around while the tracker is running
- [ ] DND
- [ ] first #rollover #automation : 'next up' should become active after planned time, 'finishedTask' autodelete (its ok now that they have the history page)
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