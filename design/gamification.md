# Design plan: Leveling areas & class system

Status: raw idea capture from conversation on 2026-07-26. Reference bank only — nothing here is built or scoped yet, and both ideas explicitly depend on other unbuilt features landing first.

## Leveling areas

Once life areas exist as a real feature (see [life-balance.md](life-balance.md)'s "areas" concept), add a way to level up a given area — gaining XP for activity within it, unlocking rewards (pets floated as one idea) as it levels.

- Hard dependency: this is a layer on top of "areas," not parallel work — areas have to exist first.
- Relates to the XP badge / XP meter sketches already noted in [day-planning.md](day-planning.md) (1a, 1i, 1n–1p) — those assumed XP lived at the *task* level; this idea puts XP at the *area* level instead. Worth reconciling task-level vs. area-level XP once both actually get designed, rather than assuming they're the same mechanic.

## Ragnarok-inspired class system

Inspired by early-2000s Ragnarok Online's class system. A "novice" character from the start, unlocking different class paths tied to whichever life areas get exercised most — e.g. heavy exercise → thief class, heavy art practice → archer class. The area→class mapping doesn't need to make narrative sense; the point is novelty and a grindy "numbers go up" feeling that gives the brain something new to chew on, in the same way Ragnarok's grind originally hooked Natalie.

- Explicit intent, in Natalie's own framing: "grindy" is the feature, not a flaw to be smoothed away — keep that when this actually gets designed, don't over-polish it into something more minimal/serious than intended.
- Hard dependency: needs leveling-areas' per-area XP data to exist first, since class unlocks are keyed off which area(s) are leveled.

## Open questions

- Does class-unlocking need every area past some threshold, or does the single most-leveled area decide class (and can it shift over time as focus shifts)?
- Are classes purely cosmetic flavor, or do they unlock anything functional (area-specific features, not just pets)?
- How do pets (mentioned under leveling areas) relate to classes — a separate reward track, or class-specific pets?
- Sequencing reminder: both ideas here sit behind "areas" (life-balance.md) and behind task/area XP tracking (day-planning.md's XP sketches) — those are the nearer-term prerequisites, not this doc.
