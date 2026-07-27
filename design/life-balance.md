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

## Habits — priority, deliberately simpler than Areas (2026-07-28)

Natalie flagged "habits" as a near-future priority, explicitly wanting it to carry *less* complexity than the full Areas system (bands, week-balance math, etc. — see below). Not yet designed how "simple habits" and "growing habit" (task type, above) and "Areas" all relate to each other — worth resolving before building any of them, so habits don't end up needing a redesign once Areas lands, the same trap Areas-before-stats was built to avoid (see `ROADMAP.md` Phase 3).

## Archive vs. delete (2026-07-25, refined 2026-07-28)

Hard-deleting a task loses it for good — fine for day-to-day clutter, but works against the whole point of week/life balance tracking, which needs history to actually balance against. Later idea: an archive (soft-delete, keeps the record) instead of / alongside hard delete, specifically for long-term balancing data. Not needed now — `Tasklist.jsx` currently hard-deletes, which is fine for the MVP stage.

**2026-07-28, decided:** finished tasks get their own section via two separate filtered lists (`tasks.filter(t => !t.done)` / `tasks.filter(t => t.done)`, not a single sorted array) specifically so that section can become collapsible — that's the reason a separate archive mechanic isn't needed for now. A true archive (surviving deletion, for long-term balance-tracking history) stays a later idea, but the immediate "hide finished tasks" need is covered by the collapsible done-section instead.

## Design exploration: "Balance Explorations" (2026-07-26)

Source: same Claude Design canvas project as `day-planning.md` (`8a763246-ab75-44de-ba87-ea90e9623033`), file `Balance Explorations.dc.html`. Sketch IDs (1a–1l) match that canvas. **Reference/idea bank only — nothing here is built.**

**The rule running through all of it:** an area has a **band** ("2–4× this week"), never a quota. Under the band is dim, not red — the *only* failure state Wren ever shows is **silence** (an area untouched for a while), never "you're behind." Bands/jars refill Monday and nothing carries over — explicitly called "the mercy."

### Vocabulary (1a–1c)
- **1a — area anatomy:** colour + glyph + a band. Exactly three kinds: **need** (has to happen), **want** (you'd like it to), **growing** (a habit on a ramp). No percentages anywhere.
- **1b — the band, not the target:** a range, not a number — inside the band you're just *done*, going further isn't praised or punished. "A single number invites overshoot, a band tells you when to stop."
- **1c — growing habit, the ramp:** growth is *offered* weekly (e.g. "ready to try 14 minutes next week?"), never automatic — "stay here" is a real, respected answer. A missed week doesn't reset the ramp, it just doesn't ask that week.

### Seven ways to show the week (1d–1j) — same week, seven shapes, tradeoffs noted for each
- **1d — orbits:** concentric rings, one per area, each fills toward its own band. Pretty; hard to read exact numbers off.
- **1e — area × day grid ("the workhorse"):** solid = done, hatched = planned, pale = untouched, per day, band column on the right. Colour depth carries minutes so a light day still reads as "showed up."
- **1f — the scales:** a literal balance beam, needs vs. wants. Most emotionally direct — and most dangerous; only works if the tilt is capped and copy stays warm, never reads as a crash.
- **1g — the shelf:** a jar/vial per area, band marked as two lines on the jar. Most on-brand, most glanceable, worst at precision. Refill Monday.
- **1h — constellation:** a star per completed session, no bands/numbers at all — pure reward/recap surface. An untouched area is an unlit outline, not a deficit. Best as end-of-week recap, not a planning tool.
- **1i — one week, one bar:** proportional bar, areas literally competing for the same finite week. Only view that shows that competition directly; weak on showing rhythm (can't tell "all in one Sunday binge" from spread-out).
- **1j — silence, not deficit:** the *one* nudge Wren gives — a `RetroWindow` ("quiet.exe") that fires only after real silence on an area, and always offers *lowering the band* as a first-class option alongside "do it now" and "rest this area for a month." Never fires on "you're at 1 of 3."

### Assembled (1k–1l)
- **1k — week view:** full composed view — the area×day grid as the spine, the jar shelf for an at-a-glance read, and exactly **one** suggestion, placed on the emptiest day (not "the next day").
- **1l — "Today, aware of the week"** (builds on sketch 1n from `day-planning.md`): shows how balance is allowed to touch the Today/Tasklist view — a thin 5-line week-progress rail in the sidebar, and *at most one* suggestion card. Tasks gain an area-colour left spine (replacing the plain energy dot). Explicit constraint: **balance shows up in Today at most twice, no more.**

## Open questions / not designed yet

- How "week balance" actually gets computed or displayed — no design exists for this at all yet.
- How growing-habit tasks track and communicate growth — does the target auto-increase, does she bump it manually, on what cadence?
- How life areas relate to Wren's existing project/subproject data model — same concept, adjacent, or unrelated?
- Whether this needs its own UI surface (a "week" view distinct from "day") or folds into the existing project/task views.
- Archive vs. delete: what does "archived" even look like in the UI — a filter toggle, a separate view, nothing visible at all?
