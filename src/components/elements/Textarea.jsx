import { useRef } from "react"
import { useEmojiChecklist, useConvertBrackets, useContinueChecklist } from "../../hooks/useEmojiChecklist"

export default function Textarea({ placeholder = '...', value, onChange, onKeyDown, width = 'w-full', padding = 'px-2 py-2', backgroundColor = 'bg-surface', rows = 2 }) {
   const textRef = useRef(null)
   const handleTextClick = useEmojiChecklist(textRef, value, onChange)
   const handleChange = useConvertBrackets(textRef, onChange)
   const handleChecklistEnter = useContinueChecklist(textRef, value, onChange)

   const handleKeyDown = (e) => {
      if (handleChecklistEnter(e)) return
      onKeyDown?.(e)
   }

   return (
      <textarea
         ref={textRef}
         placeholder={placeholder}
         value={value}
         onChange={handleChange}
         onClick={handleTextClick}
         onKeyDown={handleKeyDown}
         rows={rows}
         className={`input resize-none cursor-pointer ${width} ${padding} ${backgroundColor}`}
         style={{ fieldSizing: 'content' }}
      />
   )
}
