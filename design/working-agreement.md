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

## Doc rituals (added 2026-08-07)

Three docs get updated regularly, each with its own job and its own timing. Claude reminds rather than waits to be asked.

| Doc | What it's for | When it's touched |
| --- | --- | --- |
| `design/_Today.md` | Scratch list, written in during the day whenever an idea shows up | **Only** during the end-of-day sync, or when very explicitely told to do so — otherwise hands off |
| `design/_ROADMAP.md` | Progress, "look at soon", bigger phases | End of each session, synced against `_Today.md` |
| `CHANGELOG.md` | Versioning, outward-facing, much slimmer than the roadmap | On a branch close or after bigger changes — not every session |

- **End of day:** "closing for the day" is the cue to update `_ROADMAP.md` and sync it with `_Today.md`. If a branch close or a chunk of bigger changes is wrapping up, add a `CHANGELOG.md` entry too.
- **New feature branch:** the version number is a conversation at that point, not a unilateral bump. Scheme: major = stability/architecture statement, minor = roadmap phase MVP, patch = steps in between.
- Roadmap entries: new ✅ goes next to the last ✅ in its section, not after the open bullets below it.
