# Design plan: Day planning (day view + task capacity)

Source: Claude Design canvas **"Today Explorations"** (project `8a763246-ab75-44de-ba87-ea90e9623033`, file `Today Explorations.dc.html`), imported 2026-07-25. Builds on the base Wren Design System tokens — see [tasklist.md](tasklist.md) for the token/`@theme` integration pattern already in use.

**Status: reference/idea bank only. Nothing in this doc is built.** This is the "day planning" sprint's notes, kept as its own file on purpose so it doesn't get tangled with the (already-working) tasklist sprint. Pull one piece in at a time when it's actually next — don't batch-build this.

## The day vs. task distinction this maps onto

Natalie's framing: a **task** is one item; a **tasklist** is a set of tasks (already built — `Tasklist.jsx` + `TaskItem.jsx`); a **day** is a container that can show different tasklists depending on the day's focus (work / habits / balance / catch-up / procrastination-support — see ROADMAP.md's "focus modes" future idea). This exploration's three sections map cleanly onto that split:

- **Task item anatomy (1a–1g)** → belongs to `TaskItem.jsx`
- **Time & capacity (1h–1m)** → day-level, not task-level — a future capacity component
- **Assembled Today views (1n–1p)** → a future day-view component that composes a tasklist + capacity + XP sidebar together

(Sketch IDs match the original canvas — reference them directly if looking at the source file.)

A layer above this one: [life-balance.md](life-balance.md) covers task *types* (recurring, growing-habit, project-linked) and week-vs-day balance across life areas — this doc stays scoped to a single day's capacity/composition.

## 1. Task item anatomy (1a–1g)

- **1a — the pill row (default density):** pill-shaped row, drag handle (⁝⁝), checkbox, label, single energy dot, time chip (VT323 retro font), XP badge. Closest to what `TaskItem.jsx` already is — current version is a card/rect row (`--radius-md`), not a pill (`--radius-pill`).
- **1b — splittable task ("the 4h problem"):** big tasks split into blocks — solid segments for blocks committed today, hatched/dashed for blocks parked for tomorrow. The estimate stays whole; only committed chunks count against the day's capacity.
- **1c — collapsible subtasks:** folded by default, parent row shows "2/5" progress; subtasks never carry their own time estimate, only the parent does.
- **1d — full-detail card:** energy becomes a colored left-edge spine + word tag instead of a bare dot; priority star; category tag (e.g. "physical"), recurrence chip ("↻ weekdays"); a time-slot chip only appears once the task is actually scheduled — no empty placeholder chip.
- **1e — running task:** active/tracking state — pulsing dot, live elapsed-time counter, progress bar vs. estimate, and a learned-estimate line ("you usually need ~38m for decks"). Tracking quietly teaches the estimator; going over never reads as a scold.
- **1f — density switch:** the same task shown at three opt-in detail levels (bare / +time / +energy+priority+xp) — one preference per attribute, so turning things off doesn't reshuffle the row's rhythm.
- **1g — row actions on hover:** start-timer / edit / split / push-to-tomorrow / delete, all living inside the pill so nothing shifts on hover. Delete copy: *"gone. no XP lost — it wasn't yours to carry."* Push-to-tomorrow deliberately sits next to delete as the kinder option.

**Immediately useful takeaway:** `TaskItem.jsx` has no delete yet (open item in [tasklist.md](tasklist.md)) — 1g's hover-actions pattern plus that exact delete copy is a ready answer for when that gets built.

## 2. Time & capacity (1h–1m)

None of this exists yet in any form — these are day-level concerns, and tasks don't even have a duration field yet.

- **1h — the day tape:** one horizontal bar, tasks as proportional segments (not a fixed clock grid), overflow spills past a day-end marker as a hatched tail. Actions offered, never forced: "trim low priority" / "it's fine."
- **1i — overfull vial:** a small potion-vial capacity meter (fits the witchy motif) — normal fill vs. an overfull state that sloshes over the rim (animated). Sidebar-sized, pairs with an XP meter.
- **1j — soft timeline rail:** order-based, not a fixed grid — times are marked with "~" because they're consequences of task order, not commitments. Reordering re-times everything below it. Supports buffer rows ("15m buffer — you set low energy today").
- **1k — energy budget, not hours:** per-category budget bars (mental/hard, physical, chores). The point: overplanning isn't only about minutes — three hard-thinking tasks can wreck a day that has plenty of free hours left on the clock.
- **1l — moon dial:** circular/conic-gradient day-composition dial. Prettiest, least precise — good as an at-a-glance widget, poor for actually dragging tasks around.
- **1m — the renegotiation dialog:** uses the design system's `RetroWindow` ("too_much.exe") — when overplanned, offers specific proposed cuts by priority (shrink a block, bump to tomorrow), opt-in per item, and explicitly allows declining all of them: *"or keep it all — nothing bad happens."*

**Recommendation:** don't build any of 1h–1m until tasks can actually carry a real time estimate — right now there's nothing to compute capacity from.

## 3. Today, assembled (1n–1p)

Three full composed states of a day view: tasklist + day-tape + XP/level sidebar meter, together.

- **1n — a comfortable day:** normal state, plenty of room left.
- **1o — an overplanned day:** over capacity, "make it fit…" CTA — framed as *"ambitious ✧ that's allowed,"* not as a failure state.
- **1p — a day nearly done:** end-of-day, most tasks struck through, *"ten minutes between you and a clean day."*

This is the rough shape of a future day-view component — worth returning to once `Tasklist` and a real capacity concept both exist.

## Open questions

- `Tasklist.jsx` still visibly renders the heading "Today" — now that the component/file is `Tasklist`, should that change, or is "Today" reserved for the future day-view wrapper described here?
- None of 1a–1p is implemented — this is a reference bank, not a build queue. Pull one sketch at a time.
