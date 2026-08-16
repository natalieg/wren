import { useCallback } from 'react'
import { toggleChecklistLine, convertBrackets, continueChecklistLine } from '../utils/checklistToggle'

export function useEmojiChecklist(textareaRef, value, onChange) {
   return useCallback(() => {
      const el = textareaRef.current
      if (!el) return
      const result = toggleChecklistLine(value, el.selectionStart)
      if (!result) return

      onChange({ target: { value: result.newText } })

      requestAnimationFrame(() => {
         el.selectionStart = el.selectionEnd = result.cursorPosition
      })
   }, [textareaRef, value, onChange])
}

export function useConvertBrackets(textareaRef, onChange) {
   return useCallback((e) => {
      const el = textareaRef.current
      const result = el && convertBrackets(e.target.value, el.selectionStart)
      if (!result) {
         onChange(e)
         return
      }

      onChange({ target: { value: result.newText } })

      requestAnimationFrame(() => {
         el.selectionStart = el.selectionEnd = result.cursorPosition
      })
   }, [textareaRef, onChange])
}

export function useContinueChecklist(textareaRef, value, onChange) {
   return useCallback((e) => {
      if (e.key !== 'Enter' || e.shiftKey) return false

      const el = textareaRef.current
      if (!el) return false

      const result = continueChecklistLine(value, el.selectionStart)
      if (!result) return false

      e.preventDefault()
      onChange({ target: { value: result.newText } })

      requestAnimationFrame(() => {
         el.selectionStart = el.selectionEnd = result.cursorPosition
      })
      return true
   }, [textareaRef, value, onChange])
}
