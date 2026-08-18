
export default function VerticalBar({ value1, value2, hover1, hover2, maxValue1, maxValue2, label, subLabel, markSpecial }) {
   const bottomBar = (value1 / maxValue1) * 100
   const topBar = (value2 / maxValue2) * 100

   return (
      <div className='flex flex-col items-center gap-1 flex-1'>
         <div className='h-32 w-full flex flex-col-reverse items-center'>
            <div className={`${!value2 && 'rounded-t-sm'} w-4/5 rounded-b-sm bg-gradient-success`}
               title={hover1 || value1}
               style={{ height: `${bottomBar}px` }} />
            <div className={`${!value1 && 'rounded-b-sm'} w-4/5 rounded-t-sm bg-gradient-main`}
               title={hover2 || value2}
               style={{ height: `${topBar}px` }} />
         </div>
         {label && <span
            className={`text-xs b-2 px-1 rounded-xs ${markSpecial ? 'bg-gradient-success' : 'text-text-secondary'}`}>
            {label}
         </span>}
         {subLabel && <span className='text-[10px] text-text-muted'>{subLabel}</span>}
      </div>
   )
}
