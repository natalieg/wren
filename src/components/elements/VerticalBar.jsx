
export default function VerticalBar({ value1, value2, hover1, hover2, maxValue1, maxValue2, label, subLabel, markSpecial }) {
   const maxValue1Share = maxValue1 ? (maxValue1 / (maxValue1 + maxValue2)) * 100 : 0
   const bottomBar = (value1 / maxValue1) * maxValue1Share
   const topBar = (value2 / maxValue2) * (100 - maxValue1Share)

   return (
      <div className='flex flex-col items-center gap-1 flex-1'>
         <div className='h-40 w-full flex flex-col-reverse items-center'>
            <div className={`${!value2 && 'rounded-t-sm'} w-4/5 rounded-b-sm bg-gradient-success`}
               title={hover1 || value1}
               style={{ height: `${bottomBar}%` }} />
            <div className={`${!value1 && 'rounded-b-sm'} w-4/5 rounded-t-sm bg-gradient-main`}
               title={hover2 || value2}
               style={{ height: `${topBar}%` }} />
         </div>
         {label && <span
            className={`text-xs b-2 px-1 rounded-xs ${markSpecial ? 'bg-gradient-success' : 'text-text-secondary'}`}>
            {label}
         </span>}
         {subLabel && <span className='text-[10px] text-text-muted'>{subLabel}</span>}
      </div>
   )
}
