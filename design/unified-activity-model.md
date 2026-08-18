# Unified Activity model: merging tasks & breaks

Status: decision made (2026-08-18), roadmap below not started yet. Do this *before* projects/recurring/challenges/appointments (`_ROADMAP.md` future phases) — those would each need their own bespoke bolt-on otherwise, the same way breaks did.

## Problem

Tasks and breaks are two separate entities today, but they're the same thing wearing different clothes — something with a label, a duration, and a start/stop. Splitting them causes real damage:

- **Planned breaks don't fit either shape.** Breaks are currently tracking-only; giving them a planned state means bending them toward tasks anyway. Same will happen to appointments, challenges, real recurring tasks — every future roadmap item duplicates this problem if tasks/breaks aren't unified first.
- **History is copied, not derived.** `addToHistory`/`addBreakToHistory` in [useHistory.js](../src/hooks/useHistory.js) manually push snapshots into day buckets, and `removeFromHistory` has to manually keep that in sync when a task un-finishes. Two parallel systems (`taskList` in `useTasks`, day-bucketed `history`) tracking overlapping data.
- **Breaks and tasks log sessions differently.** A break session becomes one `{ trackedTime, finishedTimestamp }` snapshot at stop time. A task accumulates `trackedTime` as a running number across possibly many start/stop cycles, with no record of the individual sessions at all — only the total survives. Neither records `started`/`stopped` pairs, which is what actually happened.
- **Recurring tasks are already a preview of this pain.** [recurring.js](../src/utils/recurring.js) bolts habit-recurrence onto the task shape (`recurring: { id, active }`) — "Habit exists only as its tasks." Workable for one bolt-on; not for four more.

## Naming: `Activity`

Considered `Item` (too vague to search for or reason about) and `Entity` (too formal/generic, reads like a database-textbook word in an otherwise plain-English codebase).

`Activity` wins because it's already the codebase's own word for this: [activityTracking.js](../src/utils/activityTracking.js) already calls the shared task/break coordination layer `buildActivityActions`, with the comment *"the one place that knows a task timer and a break timer can never run at the same time."* The concept already exists under that name — this refactor just gives it a shape instead of leaving it implicit.

## Target shape (draft, not final)

```
Activity {
  id
  kind            // 'task' | 'break' — later: 'event', 'recurring-instance', ...
  label, emoji, color
  activationDate  // important for recurrings and later appointments 
  trackedTime     
  plannedTime     // planned/estimate, task-only for now
  list            // BACKLOG | ACTIVE | DONE | ... — reuse existing enum, extend if needed
  sessions: [{ started, stopped }]   // stopped: null while running
  // kind-specific extension fields: backlog.bucket, recurring, ...
}
```

- `trackedTime` becomes **derived** (sum of `stopped - started` per session, plus the live delta of a running session), not a separately maintained accumulator that can drift.
- `history` becomes a **filtered view** over `activities` (by day, by `kind`) instead of a hand-maintained mirror — this is the "filter from the other direction" idea. Kills `addToHistory`/`addBreakToHistory`/`removeFromHistory` as separate bookkeeping.

## Migration phases

Additive first, subtractive last — nothing breaks mid-way, legacy shape support gets deleted only once nothing reads it anymore.

1. **Add `sessions[]` alongside existing fields**, on both tasks and breaks, without removing `trackedTime`/`finishedTimestamp` yet. Low-risk: existing code keeps working untouched, new data just also gets recorded.
2. **Point every read at `sessions[]` instead of the old fields** (trackedTime displays, history views, stats), one consumer at a time, while both still get written.
3. **Merge break-type + task storage into one `activities` array.** Legacy `tasks`/`breakDurations`/`history` localStorage keys get read through a one-time migration/adapter on load (per [[project_wren_multiuser_and_pacing]] pacing — this alone is a shippable step).
4. **Make `history` a derived filter**, not a stored duplicate. Delete `addToHistory`/`addBreakToHistory`/`removeFromHistory`.
5. **Delete the legacy fields and adapters** once confident nothing depends on them — `trackedTime` as a stored number, `finishedTimestamp`, the old `breakDurations` key.
6. **Unlocked after this:** planned breaks, appointments/Termine, challenges, and a real recurring-task model all become `kind` variants reusing `list`, `sessions`, and estimate infra instead of separate bolt-ons.

## Open questions

- Does `sessions[]` correctly replace today's pause/resume accumulation (5-min flush safety net in [useTracker.js](../src/hooks/useTracker.js), visibility-change recovery)? Needs checking per session-boundary edge case, not assumed to just work.
- Where do planned-but-not-started breaks sit in `list`/status — mirror the task `BACKLOG`/`ACTIVE` states, or need their own?
- Migration/versioning strategy for existing `localStorage` data — a `schemaVersion` flag, or shape-sniffing like `normalizeTask` already does?
