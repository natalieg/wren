# Changelog

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