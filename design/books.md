# Design plan: Books tab

Status: raw idea capture from conversation on 2026-07-26 (Natalie's own words, lightly organized — "sorry for mixed things but that's just how my brain works"). Reference bank only — nothing here is built or scoped yet.

## The core idea

Books as a first-class feature, structurally similar to a project: a book can surface on the day list — e.g. a "continue this book" recommendation — the same way a project's tasks might, which matters if the goal is reading daily rather than in occasional binges.

## Possible pieces

- **Own tab:** a standalone books section/tab.
- **Pinnable:** possibly pinnable for other users — this note is ambiguous as captured (sharing a book/recommendation with someone else viewing Wren? visibility toggle?) — revisit and clarify before designing.
- **Global page goal:** a daily page-count goal set in the books tab, which is what would actually drive a "continue this book" day-list suggestion.
- **To-read stack:** the current to-read collection, shown in the books tab.
  - Future: sortable by date-added, so there's a visible incentive to read down older backlog entries instead of always picking the newest.
  - A self-imposed cap idea: "read the stack down to 10 books before buying anything new" / "read X books before adding another" — a rule the app could nudge, not necessarily enforce.
- **Visual stack styling:** render books like actual books (spines/covers) in the stack view, with physical (RL) books drawn bigger than ebooks — a nice-to-have detail, not needed for a first version.
- **Reading stats:** daily/monthly/yearly reading-amount stats, plus yearly goals in the Goodreads sense.

## Open questions

- What "pinnable for other users" actually means in practice.
- Does a book live as its own data type, or as a flavor of "project" (see [life-balance.md](life-balance.md)'s task-type taxonomy — general / project-linked / recurring / growing-habit)? Reading could plausibly be a growing-habit-linked task type instead of a wholly new object.
- How a "continue this book" day-list recommendation would actually get chosen — most-recently-read? furthest from page-goal? manually pinned?
- `bookstack.html` in `references/` (see ROADMAP.md's reference-apps table) is very likely the closest prior art here — worth reading before designing this further, and a migration candidate once this tab gets built.
