
export default function VerticalBar({ value1, value2, hover1, hover2, maxValue, label, subLabel, markSpecial }) {
   const bottomBar = (value1 / maxValue) * 100
   const breakPct = (value2 / maxValue) * 100

   return (
      <div className='flex flex-col items-center gap-1 flex-1'>
         <div className='h-32 w-full flex flex-col-reverse items-center'>
            <div className='w-4/5 rounded-b-sm bg-gradient-success'
               title={hover1 || value1}
               style={{ height: `${bottomBar}%` }} />
            <div className='w-4/5 rounded-t-sm bg-gradient-main'
               title={hover2 || value2}
               style={{ height: `${breakPct}%` }} />
         </div>
         {label && <span
            className={`text-xs b-2 px-1 rounded-xs ${markSpecial ? 'bg-gradient-success' : 'text-text-secondary'}`}>
            {label}
         </span>}
         {subLabel && <span className='text-[10px] text-text-muted'>{subLabel}</span>}
      </div>
   )
}
