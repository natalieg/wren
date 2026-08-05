# Data architecture: from localStorage to a real backend

Status: decision recorded, not scheduled. Nothing here is being built yet — this is groundwork so the "when do we switch" conversation doesn't have to happen from scratch later.

## Current state

Everything lives in `localStorage` (`Tasklist.jsx`). Fine for now — a task list is nowhere near the ~5–10MB browser storage cap, and nothing yet needs querying across time.

## When it stops being fine

Not the storage limit — the shape of what Wren needs to *do* with the data:

- **Historical queries.** Once week/life-balance tracking (`design/life-balance.md`) is real, the app needs things like "everything tagged `area:exercise` over the last 8 weeks" — painful as a JS array filter, exactly what a database is for.
- **ManicTime import** (`ROADMAP.md` future ideas) needs something running server-side to reconcile external data on a schedule — can't do that from a closed browser tab.
- **Durability.** Clearing browser data currently loses everything. Acceptable for a scratch list; not once it's months of balance history actually worth protecting.

None of that is live yet — realistically this becomes relevant around **ROADMAP Phase 10 & 13** (day split / projects), not before.

## The decision: Python + FastAPI, not a hosted BaaS

Considered Supabase (hosted Postgres, minimal setup, handles auth/sync out of the box) vs. a self-built Python + FastAPI backend. Went with **Python + FastAPI**, deliberately, over the easier option:

- Natalie already has Python from another project — not starting from zero.
- She wants real, transferable backend skills (API design, an ORM, auth, hosting) for career reasons — the dev job market is tough right now, and personal-project depth is something she wants to be able to speak to in interviews.
- It's also literally useful day-to-day: she works alongside a backend dev at her job and wants to actually understand what they do.
- This is a case where "more to learn" was the point, not a drawback — picked on purpose, not because Supabase was wrong.

Rough shape: a small FastAPI service Wren's React frontend talks to (instead of touching `localStorage` directly), backed by **SQLite** to start (zero setup, a single file, no server process to run) — graduating to Postgres later only if there's an actual reason to (concurrent access, bigger scale). No rush to pick Postgres on day one.

## How to work this into sessions

Time/date arithmetic already gets more direct help than pure hints (`feedback_workflow` memory) — the same applies here, more so: this is new-concept territory for her, not a skill-refresh. Lean toward pairing/explaining, not just nudging. Still her call how hands-on she wants to be per session.

## Open questions

- Auth: does Wren even need user accounts if it's single-user (just Natalie)? Possibly not for a long time — worth not over-building this.
- Hosting: where does the FastAPI service actually run? Not decided, not urgent.
- Migration path: how does existing `localStorage` data (tasks already in use by then) get moved over when this actually happens?
