# Changelog

## 0.8.12 — 2026-10-21
- **Projects**: new setting **⌛ Time Block Only** on the project card. When it's on, the project's today tasks only show in the day list inside a time block. Tasks outside a block wait in the project's Today and don't count in the day's planned time. A line under the day list shows how many are waiting ("3 Solverint tasks wait for a block")
- A new block for the project picks the waiting tasks up right away, and **✦ fill** pulls them in too. A running task always stays visible
- Fix: a block's buffer now counts general time and tasks that took longer than estimated. Before, a block could say "buffer" when its time was already used up

## 0.8.11 — 2026-10-19
- **Projects**: click the weekly time on a project card for a log of which tasks add up to that number
- Tracked time is now also stored per day, so the weekly number only counts what happened this week, even for parked or long-running tasks. Time tracked before this update has no date and isn't counted, also not when the task is finished (the log shows it as "undated"). To count it anyway, set the task's tracked time to 0 and type it in again, it then lands on today
- Fix: tasks finished without tracking now count their estimate in a project's weekly time and inside a time block, same as in History
- Changelog shows **bold** text properly

## 0.8.10 — 2026-10-19
- ⚠️ **Largely untested** — built in one go, only clicked through briefly. Expect rough edges, especially with drag and drop
- **Time blocks**: switch the input next to the task field to ▦ and add a block, e.g. "Solverint · 4h". Type a project name (suggestions appear) or any free topic like "Programming"
- A block groups tasks in the day list: drag tasks in and out, add one with **+ add**, or **✦ fill** it with the project's loose today and next-up tasks (the number shows how many are waiting)
- A block always takes its full time in the planned day, or more if its tasks need more. Its end time sits at the bottom of the block
- The header shows tracked vs. planned time and whether there's buffer, the plan fits (±10m), or you're over. Going over is only a hint, never a penalty
- **⫸ general** in the header: track time on the block that belongs to no task. Editable afterwards in minutes, in case you forgot to track
- Project blocks only take their own project's tasks (the frame turns red otherwise). Tasks without a project are welcome and join the project. Topic blocks take anything
- Finishing or deleting a block keeps its tasks on the day list. Blocks stay through rollover and "Clear day"
- **Projects**: each project card shows the time tracked on it this week
- Task modal is wider and wraps instead of overflowing on backlog tasks

## 0.8.9 — 2026-10-07
- ⚠️ **Untested in daily use** — needs a proper code + styling review soon
- **Pinned tasks**: give a task a fixed start time (📌 Starts in the task modal) for meetings and appointments
- Tasks plan themselves around pinned ones: a task that wouldn't finish before the appointment moves behind it
- Free time before an appointment shows as `┈ 20m free ┈`
- Pinned tasks can't be dragged, change the time in the modal instead
- The 📌 time turns pink when the task before runs into the appointment
- Pins only count for the day they're set. On the next day the pin is removed and the old time is added to the task's notes (`📌 was pinned to 14:00 on 06.10.2026`)
- Recurring tasks keep their pinned time every day
- Unpin with the ✕ next to the time field
- ↑/↓ arrow left of the task input: add new tasks to the top or bottom of the list

## 0.8.8 — 2026-09-16
- New **Projects** tab: create simple projects with a notes area, then sort tasks into Today/Next Up/Next Week/Someday per project — same drag-and-drop as the day list and Backlog
- Tasks tagged to a project show a small project label on their row
- **Clear Day**: right-click the active task list to reset it back to Next Up without deleting anything (context menu)
- Fix: planned break time now factors into the estimated finish time
- Modal styling fixes

## 0.8.7 — 2026-08-25
- Notes can be synched through a family of tasks (eg Task 1, Task 2,...)
- Finished tasks that are set unfinished again will be asynchronos by design 
- ⚠️ Attention: This is no advenced synch feature, if multiple tasks in a family exist, the last task that is set to 'synch tasks' will win - other notes will be overwritten.

## 0.8.6 — 2026-08-18
- Export/import: back up history, tasks, settings and Trello credentials to a JSON file from Settings, and restore from one — a stopgap against losing months of browser-only data before there's a real database.

## 0.8.5 — 2026-08-17
- History day entries show a color-coded breakdown of task time vs. each break type, with a legend and the biggest slice highlighted
- New weekly overview above each week in History — collapsible bar chart of focus vs. break time per day plus task count, and total focused/off-the-clock/break-to-focus stats
- Fix: Stopping breaks now also updates the 'active Timestamp' which influences how the 'estimate finish Time' is calculated
- Update behaviour: Floating Task Panel now have the 'done' checkbox and can be 'finished' from anywhere

## 0.8.4 — 2026-08-16
- "Notes" Textarea in Task Modal
- Can Add Subtasks in Notes (Current workaround before implementing 'real' subtasks)
- Subtasks can be added with [], [] transforms into 🟦
- 🟦✅ can be toggled by click
- current 'progress' of Subtasks is visible on Tasks and in Modal

## 0.8.3 — 2026-08-16
- Change Breaktime max durations in settings
- default breaktimes can be deleted/added
- Styling enhancement of pause display

## 0.8.2 — 2026-08-15
- Predefined Breaktime Limits [5,10,15,20]
- new Overflow behaviour
- optional sound when Breaktime ends

## 0.8.1 — 2026-08-15
- Breaktime shows in Browser Tab

## 0.8.0 — 2026-08-14
- **Break** tracking: a floating panel to start/stop breaks by type (🍵 break, 🎮 gaming, 🫂 social ore configured), each tracked separately and rolled into History alongside task time. Types can be turned on/off in Settings. Turning all of them off removes the panel. 
- Minimized panel shows current break or default break only - can also be used for play/pausing breaks
- **Sound** settings: pick the sound that plays when a running task passes its time estimate, toggle the finished-task sound on/off, and one volume control that applies to both — each with a preview button.
- Break and task start/stop now go through one coordinated layer, so starting either one always stops the other.

## 0.7.1 — 2026-08-11
- Duplicate tasks with [d], only works on non-recurring Tasks
- Delete tasks with [x], only works on non-recurring Tasks

## 0.7.0 — 2026-08-10
- Daily habits. Mark a task recurring (↻ in the edit panel) and it comes back the next day as a fresh task, keeping its name, its planned time and a count of how often you've done it. Yesterday's finished one stays in the list with its tracked time intact.
- A habit can be paused instead of deleted — switch the ↻ off and it keeps everything, it just stops coming back.
- Deleting can't end a habit by accident. Clearing out finished tasks always leaves the habit parked for tomorrow, and deleting an unfinished one asks first, with "park for tomorrow" as a third option.
- Task ids are now unique for good. Previously a deleted task freed its id for reuse, which could let a new task inherit an old one's history entries.

## 0.6.0 — 2026-08-09
- Drag and drop on the day list — grab a task anywhere on the row and reorder it. Short clicks still open the edit modal; the checkbox, play and delete buttons keep working.
- The running task is pinned to the top and can't be dragged or dropped on, so a timer never gets shuffled away mid-session. It stays put when you stop it, too.
- New order survives a refresh — task order is simply the order in storage, so nothing new had to be saved.
- Drag a task between lists: onto Next up to park it, back onto the day list to activate it. The target list opens a gap while you drag, so you see where it lands before letting go.
- Drag a task onto Finished to tick it off, or drag a finished one back out to un-tick it. Both go through the normal finish logic, so the timestamp and the history entry are still written.
- A floating copy of the task follows the cursor while dragging, and lists that can't take the task mid-drag show a dashed placeholder where it would land.
- Drop onto a collapsed section and it takes the task without opening — the whole section lights up as a target, so nothing on the page moves while you're holding something.
- Empty lists can be dropped into too. Next up and Finished stay visible when empty, so there's always somewhere to aim.
- The Backlog page drags as well: reorder inside a bucket, or drag a task from Next up to Next week or Someday. The ▲/▼ shift arrows are gone, they were only ever a stand-in for this.
- Fixed: leaving the finished list any way other than the checkbox — the edit panel's active badge, or starting the timer — left the task with its completion time and its history entry intact.

## 0.5.0 — 2026-08-09
- Trello board as a Wren page (`/trello`, `src/pages/trello/`, `utils/trello.js`) — read-only view of the shared board's lists and cards, plus creating a card per list. Auth is the shared app key baked in; each person fetches their own Trello token once and pastes it in. The board id is a default, not a lock.
- Time tracking in the edit modal: live tracked time, play/pause, progress bar that glows once you pass the planned time. Tracked time is editable in minutes while stopped and read-only while the timer runs, so a typed value can't collide with the failsafe flush.
- Fixed the tracking "hiccup" — seconds occasionally stalled then jumped by 2. Timer ticks now aim at the next second boundary instead of firing every 1000ms.
- `LabeledField` — labelled inputs with an optional read-only badge mode on identical box metrics, so switching modes doesn't shift the layout. `slim` variant on `Input`.
- Shift+Enter makes a newline in a task label; plain Enter closes the modal.
- One rule for "tracked time, or the estimate below a minute" (`effectiveMinutes`) instead of four copies with two different thresholds. Time unit conversions go through `secondsToMinutes`/`minutesToSeconds` everywhere.
- Tests gate the deploy: `npm run build` runs the suite first, so a red test keeps the last working version live. GitHub Actions runs lint + tests on every branch.

## 0.4.0 — 2026-08-07
- Settings MVP (`/settings`, `useSettings.js`, `utils/settings.js`) — persisted settings object in localStorage, merged over `DEFAULT_SETTINGS` on load so later-added settings get a sane value for existing users. `InputRow`/`CheckboxRow` rows.
- Configurable rollover hour (`utils/rollover.js`) — the day boundary shifts off midnight, so e.g. 3:59am still counts as yesterday. History groups finished tasks by logical day.
- Configurable default start time; new day starts at the later of now / the planned start, so estimates never cascade from the past. Manual "start now" reset.
- First rollover actions: auto-activate `nextUp` backlog tasks and auto-delete finished tasks on a new day, each behind its own setting.
- `useDayActions.js` owns the day boundary and `startedAt`; task side effects are passed in via `onRollover`, keeping task logic in `useTasks`.
- Dev-only "Simulate next rollover" button on the settings page (pushes `startedAt` 25h back and reloads).
- Tests for rollover, day actions, history grouping, and legacy task migration.

## 0.3.1 — 2026-08-06
- Task keyboard shortcuts (`config/taskShortcuts.js`, `useTaskKeyboardShortcuts.js`), incl. on the Backlog page.
- Keyboard navigation for `MultiSwitchFlag`; backlog tasks can be submitted straight from the flag.
- Tasks can be moved to the bottom of the list.
- Fix: edit modal no longer vanishes when a task changes context.

## 0.3.0 — 2026-08-05
- Backlog MVP (`/backlog` route). Task data model consolidated to a single `list: 'active'|'done'|'backlog'` enum plus `backlog: {bucket, activationDate}` (buckets: `nextUp`/`nextWeek`/`someday`). Legacy tasks migrate on load.
- Shared `TaskInput` and `SwitchFlag` components (bucket picker on add + in edit modal).
- Bucket reassignment via ▲/▼ shift arrows on the Backlog page.

## 0.2.0 — 2026-08-04
- History page (`/history`, `useHistory.js`) — finished tasks archive separately from the active list, survive deletion.
- `TasksProvider`/`TasksContext` lifted to `App.jsx` so the running timer survives in-app navigation.
- `FloatingTaskPanel.jsx` — draggable mini panel mirroring the tracked task on non-Home pages.
- Real time tracking: start/stop per task, live ticking, persisted `trackedTime`, 5min failsafe flush, cascading per-task estimates.
- Edit task label/time via modal; finished tasks sort into a collapsible section.

## 0.1.0 — 2026-07-27
- Daylist MVP (`/` → `Tasklist.jsx`): add, display, toggle done, delete, "delete all finished," persist to localStorage.
- Per-task time estimate, done-vs-left `Bar` panel.

---


Informal — versions map to Phase milestones in `design/_ROADMAP.md`, not a formal release process. Minor bump when a phase hits its MVP threshold, patch bump for smaller steps in between.