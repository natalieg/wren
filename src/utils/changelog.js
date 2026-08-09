// Minimal markdown reader for CHANGELOG.md — it only understands the shape that file
// actually uses: an intro paragraph, `## version — date` headings, `- ` bullets and
// `backtick` code spans. Anything fancier (bold, links, nested lists) passes through as
// plain text rather than breaking, so the page never blanks out on an unexpected line.
// Parses CHANGELOG.md's headings/bullets; unknown markdown falls through as plain text.

const VERSION_HEADING = /^##\s+(.*)$/
const BULLET = /^[-*]\s+(.*)$/

/**
 * @param {string} raw — the CHANGELOG.md file contents
 * @returns {{ intro: string, entries: {version: string, date: string, items: string[]}[] }}
 */
export function parseChangelog(raw) {
   const intro = []
   const entries = []

   for (const line of String(raw ?? '').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('# ')) continue

      const heading = trimmed.match(VERSION_HEADING)
      if (heading) {
         const [version, date] = splitHeading(heading[1])
         entries.push({ version, date, items: [] })
         continue
      }

      const bullet = trimmed.match(BULLET)
      const current = entries[entries.length - 1]
      if (bullet && current) {
         current.items.push(bullet[1])
      } else if (!current) {
         intro.push(trimmed)
      } else {
         // continuation line of the previous bullet
         const last = current.items.length - 1
         if (last >= 0) current.items[last] += ' ' + trimmed
      }
   }

   return { intro: intro.join(' '), entries }
}

// "0.5.0 — 2026-08-09" → ['0.5.0', '2026-08-09']; em dash or hyphen, date optional.
function splitHeading(text) {
   const [version, ...rest] = text.split(/\s+[—–-]\s+/)
   return [version.trim(), rest.join(' — ').trim()]
}

/**
 * Splits a line into plain and `code` chunks for rendering.
 * @returns {{ text: string, code: boolean }[]}
 */
export function splitInlineCode(line) {
   return String(line ?? '')
      .split('`')
      .map((text, i) => ({ text, code: i % 2 === 1 }))
      .filter(chunk => chunk.text !== '')
}
