import { describe, it, expect } from 'vitest'
import { parseChangelog, splitInlineCode } from './changelog'

const sample = `# Changelog

Informal — versions map to Phase milestones.

## 0.5.0 — 2026-08-09
- Trello board as a Wren page
- Time tracking in the edit modal

## 0.1.0 — 2026-07-27
- Daylist MVP
`

describe('parseChangelog', () => {
    it('keeps the intro paragraph and drops the title', () => {
        const { intro } = parseChangelog(sample)
        expect(intro).toBe('Informal — versions map to Phase milestones.')
    })

    it('splits version and date out of the heading', () => {
        const { entries } = parseChangelog(sample)
        expect(entries.map(e => [e.version, e.date]))
            .toEqual([['0.5.0', '2026-08-09'], ['0.1.0', '2026-07-27']])
    })

    it('collects bullets under their version', () => {
        const { entries } = parseChangelog(sample)
        expect(entries[0].items).toHaveLength(2)
        expect(entries[1].items).toEqual(['Daylist MVP'])
    })

    it('folds a wrapped bullet back into the previous item', () => {
        const { entries } = parseChangelog('## 0.1.0 — 2026-07-27\n- first line\n  second line\n')
        expect(entries[0].items).toEqual(['first line second line'])
    })

    it('survives empty input', () => {
        expect(parseChangelog('')).toEqual({ intro: '', entries: [] })
    })
})

describe('splitInlineCode', () => {
    it('marks backticked spans as code', () => {
        expect(splitInlineCode('see `utils/trello.js` for it')).toEqual([
            { text: 'see ', code: false },
            { text: 'utils/trello.js', code: true },
            { text: ' for it', code: false },
        ])
    })

    it('leaves a plain line as one chunk', () => {
        expect(splitInlineCode('plain line')).toEqual([{ text: 'plain line', code: false }])
    })
})
