# Wren — vision & working agreement

Split out of `_ROADMAP.md` (2026-08-07) so the roadmap itself is just phases.

## The vision

Right now daily life runs across Sunsama, ClickUp, a handful of pomodoro apps, and ~17 standalone single-page mini-apps in `references/` (trackers, planners, curricula). ClickUp stays for work. Everything else — private planning, habit/practice tracking, day structure, procrastination help — should eventually live in **Wren**.

This is a slow build alongside freelance work and art practice, not a sprint. Small, reviewable increments beat big rewrites.

## Working agreement

- **Max 3 file changes per unprompted batch.** Anything bigger stops and asks first.
- Work through `references/` one file at a time (inventory: `design/references-inventory.md`). Delete a reference file only once its useful parts are actually migrated in — never preemptively.
- Prefer incremental visible progress (something you can look at / use each session) over long invisible groundwork.
- **Shells vs. implementation:** Claude can rough in empty/skeleton structure (new component files, routing, folder layout) without asking first. Actual implementation (data model, logic, persistence) gets designed together before it's written.
- **Daily quest:** when there's a natural next coding step, offer it as a self-implement quest with hints, not finished code — the point is to keep dev skills warm, not just to ship fast.
- **Delegation splits by type of work (added 2026-08-06):** refactoring is a pain point and welcome to hand off, largely or entirely. New features are the part to keep building myself. The occasional bug fix / troubleshooting session is fine to hand off too. Tests: Claude writes and edits them directly, no asking needed.
- **Time and date math is an explicit exception** — pair on it or let Claude write it, rather than hints-only. Easy to get subtly wrong, and not the skill this project exists to sharpen.
- This project has stalled before (multiple times, always by restarting from scratch on a new project instead of continuing an old one). The explicit goal this round is to **rework what's already here**, not start over. If a "maybe we should just rebuild this part" temptation comes up, flag it explicitly rather than just doing it.
