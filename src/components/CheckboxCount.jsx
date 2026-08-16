import { UNCHECKED, CHECKED } from '../utils/constants'

const countOccurrences = (text, symbol) => [...(text || '')]?.filter(c => c === symbol)?.length

export default function CheckboxCount({ text }) {
   const checks = countOccurrences(text, CHECKED)
   const unfinished = countOccurrences(text, UNCHECKED)

   if (checks === 0 && unfinished === 0) return null

   return (
      <div className='flex ml-2 gap-2 text-xs text-onSurfaceVariant'>
         <div>{UNCHECKED} {unfinished}</div>
         <div>{CHECKED} {checks}</div>
      </div>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export function CompactCheckboxCount({ text }) {
   const checks = countOccurrences(text, CHECKED)
   const unChecked = countOccurrences(text, UNCHECKED)
   const combined = unChecked + checks
   const isFinished = checks === combined
   if (combined === 0) return null

   return (
      <div className='flex gap-1 text-xs'>
         <span> {checks}/{combined} </span><span>{isFinished ? CHECKED : UNCHECKED}</span>
      </div>
   )
}
