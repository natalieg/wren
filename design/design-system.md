# Wren — design system summary

Split out of `_ROADMAP.md` (2026-08-07) so the roadmap itself is just phases.

Imported (read-only, not yet applied) from the Claude Design MCP project **"Wren Design System"**. Full source of truth lives there — this is just the summary:

- **Direction:** the old dark mauve/teal/near-black scaffold is being replaced with a **light-default**, "90s-retro witchy pastel" theme. Dark theme stays available (`[data-theme]`), just not default anymore.
- **Palette:** violet primary, gold secondary (kept from the old brand), mint/peach/pink/sky as playful gamification accents, plum-tinted neutrals.
- **Type:** Cinzel Decorative (display/logo only), Cinzel (nav/headings, small doses), **Quicksand** (all body text — the actual readability fix), VT323 (retro-mono, stat counters/timers/window-chrome only).
- **Signature motif:** `RetroWindow` — a 90s-OS dialog (title bar, window controls) for gentle, low-pressure procrastination-help nudges. Voice: warm, second person, never scolding.
- **Delivered components:** Button, Card, Divider, Badge, ProgressBar, Checkbox, Input, Switch, NavItem, Tabs, RetroWindow — plus click-through mockups of Sidebar, TodayView, WeekView, ProjectsView built against Wren's actual shape.

Wiring the dark variant up app-wide is its own roadmap phase (Phase 4), pulled forward so components built in the meantime don't need retrofitting.
