# Design plan: Life balance & task types

Status: raw product thinking, not sourced from a design canvas — captured directly from conversation on 2026-07-25. Reference only; nothing here is built or even fully specified yet, and it's expected to raise more questions than it answers.

## The core idea

Natalie's own framing: there are many things she'd like to do (work, exercise, cleaning, drawing, journaling…) but treating them all as the same kind of "task" causes friction — the "I need to do everything" pattern. Reframing as **life areas** rather than one flat list, and preferring **week balance over day balance**, since daily consistency on everything is often unrealistic but a week has more slack to actually balance across areas.

Relationship to the other design docs: [tasklist.md](tasklist.md) is the working single-list CRUD piece (already built); [day-planning.md](day-planning.md) is about a single day's capacity/composition (sourced from the design canvas). This doc sits a layer above both — it's about task *types* and a *weekly*, not daily, balancing lens.

## Task types (draft taxonomy)

- **General tasklist:** one-off must-do items (a specific commissioned artwork, tax paperwork, etc.) — this is what already exists (`Tasklist.jsx`).
- **Project-related tasks:** tasks tied to an actual Wren project (the project/subproject tree already sketched in `dummyData.js` / `ProjectPanel.jsx`) — not connected to the tasklist at all yet.
- **Recurring tasks:** things meant to repeat — flagged as "the bigger problem" in Natalie's own words, since most daily-recurrence goals aren't realistically achievable every single day, and a rigid recurring model would just generate guilt/broken streaks instead of helping.
- **Growing habit** (a recurring sub-type): starts deliberately small (e.g. 5 min/day) and is meant to grow over time — an easier on-ramp than committing to the "full" version of a habit from day one.

## Example life areas (concrete, from Natalie's own list)

- Work — needs 3–6 hours, varies by day.
- Exercise — wants daily; a natural "growing habit" candidate.
- Cleaning the flat — x minutes per day, or every other day.
- Drawing — a want, not a need.
- Journaling — a want, not a need.

## Planned task field: `area`

Once tasks have types (above), tagging each with a life `area` (short for life area) is the natural next attribute — not implementing yet, just keeping the field in mind so future work (task model changes, filtering UI) doesn't have to retrofit it in.

## Archive vs. delete (2026-07-25)

Hard-deleting a task loses it for good — fine for day-to-day clutter, but works against the whole point of week/life balance tracking, which needs history to actually balance against. Later idea: an archive (soft-delete, keeps the record) instead of / alongside hard delete, specifically for long-term balancing data. Not needed now — `Tasklist.jsx` currently hard-deletes, which is fine for the MVP stage.

## Open questions / not designed yet

- How "week balance" actually gets computed or displayed — no design exists for this at all yet.
- How growing-habit tasks track and communicate growth — does the target auto-increase, does she bump it manually, on what cadence?
- How life areas relate to Wren's existing project/subproject data model — same concept, adjacent, or unrelated?
- Whether this needs its own UI surface (a "week" view distinct from "day") or folds into the existing project/task views.
- Archive vs. delete: what does "archived" even look like in the UI — a filter toggle, a separate view, nothing visible at all?
