import { UNCHECKED, CHECKED } from './constants'

export function toggleChecklistLine(text, cursorPosition) {
   const isMatchAt = (index, symbol) => text?.slice(index, index + symbol.length) === symbol

   let emojiStart = null
   let prefix = null

   if (isMatchAt(cursorPosition, UNCHECKED)) { emojiStart = cursorPosition; prefix = UNCHECKED }
   else if (isMatchAt(cursorPosition, CHECKED)) { emojiStart = cursorPosition; prefix = CHECKED }
   else if (isMatchAt(cursorPosition - UNCHECKED.length, UNCHECKED)) { emojiStart = cursorPosition - UNCHECKED.length; prefix = UNCHECKED }
   else if (isMatchAt(cursorPosition - CHECKED.length, CHECKED)) { emojiStart = cursorPosition - CHECKED.length; prefix = CHECKED }

   if (emojiStart === null) return null

   const newPrefix = prefix === UNCHECKED ? CHECKED : UNCHECKED
   return {
      newText: text?.slice(0, emojiStart) + newPrefix + text?.slice(emojiStart + prefix.length),
      cursorPosition,
   }
}

export function convertBrackets(text, cursorPosition) {
   if (text?.slice(cursorPosition - 2, cursorPosition) !== '[]') return null

   return {
      newText: text?.slice(0, cursorPosition - 2) + UNCHECKED + ' ' + text?.slice(cursorPosition),
      cursorPosition: cursorPosition - 2 + UNCHECKED.length + 1,
   }
}

export function continueChecklistLine(text, cursorPosition) {
   const lineStart = text?.lastIndexOf('\n', cursorPosition - 1) + 1
   const lineEnd = text?.indexOf('\n', lineStart)
   const line = text?.slice(lineStart, lineEnd === -1 ? text?.length : lineEnd)

   const prefix = line?.startsWith(UNCHECKED) ? UNCHECKED
      : line?.startsWith(CHECKED) ? CHECKED
         : null
   if (!prefix) return null

   const isEmpty = line.slice(prefix.length).trim() === ''
   if (isEmpty) {
      return {
         newText: text?.slice(0, lineStart) + text?.slice(lineStart + line.length),
         cursorPosition: lineStart,
      }
   }

   const insertion = '\n' + UNCHECKED + ' '
   return {
      newText: text?.slice(0, cursorPosition) + insertion + text?.slice(cursorPosition),
      cursorPosition: cursorPosition + insertion.length,
   }
}
