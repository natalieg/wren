## Task Modal 'Time Feature'
- [ ] #editModal  edit "tracked" time / reset tracked time 
- [ ] - [ ] [[Time Tracking 260801]] ( MVP) 
	- [ ] '**popup modal**' could be an opportunity for a simple 'focus mode'
		- [ ] update time display [current/planned]
		- [ ] add the 'track time' btn 
		- [ ] make it possibel to edit the 'tracked time'
	- [ ] for 'inactive Tasks' and maybe 'active' to style the 'estimate' time differently, or hide it completely, if the elapsed time is larger than planned 
	- [ ] numbers should not 'wobble' around while the tracker is running

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