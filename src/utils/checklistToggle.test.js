import { describe, it, expect } from 'vitest'
import { toggleChecklistLine, convertBrackets, continueChecklistLine } from './checklistToggle'
import { UNCHECKED, CHECKED } from './constants'

describe('toggleChecklistLine', () => {
   it('toggles unchecked to checked when the cursor sits right after the emoji', () => {
      const text = `${UNCHECKED} buy milk`
      const result = toggleChecklistLine(text, UNCHECKED.length)

      expect(result.newText).toBe(`${CHECKED} buy milk`)
      expect(result.cursorPosition).toBe(UNCHECKED.length)
   })

   it('toggles checked back to unchecked when the cursor sits right before the emoji', () => {
      const text = `${CHECKED} buy milk`
      const result = toggleChecklistLine(text, 0)

      expect(result.newText).toBe(`${UNCHECKED} buy milk`)
   })

   it('toggles an emoji anywhere in the line, not just at line start', () => {
      const text = `note: ${UNCHECKED} buy milk`
      const cursor = 'note: '.length
      const result = toggleChecklistLine(text, cursor)

      expect(result.newText).toBe(`note: ${CHECKED} buy milk`)
   })

   it('returns null when the cursor is not next to an emoji', () => {
      const text = `${UNCHECKED} buy milk`
      expect(toggleChecklistLine(text, 5)).toBeNull()
   })

   it('returns null instead of throwing when text is undefined', () => {
      expect(toggleChecklistLine(undefined, 0)).toBeNull()
   })
})

describe('convertBrackets', () => {
   it('converts "[]" right before the cursor into the unchecked emoji', () => {
      const text = 'buy milk []'
      const result = convertBrackets(text, text.length)

      expect(result.newText).toBe(`buy milk ${UNCHECKED} `)
      expect(result.cursorPosition).toBe(`buy milk ${UNCHECKED} `.length)
   })

   it('works mid-sentence, not just at line start', () => {
      const text = 'todo [] milk'
      const result = convertBrackets(text, 'todo []'.length)

      expect(result.newText).toBe(`todo ${UNCHECKED}  milk`)
   })

   it('returns null when the two characters before the cursor are not "[]"', () => {
      expect(convertBrackets('buy milk', 8)).toBeNull()
   })

   it('returns null instead of throwing when text is undefined', () => {
      expect(convertBrackets(undefined, 2)).toBeNull()
   })
})

describe('continueChecklistLine', () => {
   it('continues a non-empty checklist line with a new unchecked line', () => {
      const text = `${UNCHECKED} buy milk`
      const result = continueChecklistLine(text, text.length)

      expect(result.newText).toBe(`${UNCHECKED} buy milk\n${UNCHECKED} `)
      expect(result.cursorPosition).toBe(result.newText.length)
   })

   it('continues a checked line with a new unchecked line too', () => {
      const text = `${CHECKED} buy milk`
      const result = continueChecklistLine(text, text.length)

      expect(result.newText).toBe(`${CHECKED} buy milk\n${UNCHECKED} `)
   })

   it('exits the list instead of adding another empty item', () => {
      const text = `${UNCHECKED} buy milk\n${UNCHECKED} `
      const result = continueChecklistLine(text, text.length)

      expect(result.newText).toBe(`${UNCHECKED} buy milk\n`)
      expect(result.cursorPosition).toBe(`${UNCHECKED} buy milk\n`.length)
   })

   it('returns null when the current line is not a checklist line', () => {
      expect(continueChecklistLine('just a note', 5)).toBeNull()
   })

   it('returns null instead of throwing when text is undefined', () => {
      expect(continueChecklistLine(undefined, 0)).toBeNull()
   })
})
