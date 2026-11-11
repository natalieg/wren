import useSettingsContext from '../../hooks/useSettingsContext'
import { stepBuffer } from '../../utils/buffer'

// buffer minutes between tasks, only shown while the setting is on
export default function BufferChip() {
   const { settings, updateSetting } = useSettingsContext()
   if (!settings.bufferEnabled) return null
   const change = (direction) => updateSetting('bufferMinutes', stepBuffer(settings.bufferMinutes, direction))
   const stepClass = 'w-5 h-5 rounded-sm bg-gold/25 hover:bg-gold/50 leading-none softTransition'

   return (
      <div title='Buffer between tasks'
         className='flex items-center gap-1 shrink-0 self-stretch rounded-md border border-border-soft bg-surface px-2 text-sm text-text-secondary select-none'>
         <span>☕</span>
         <button type='button' className={stepClass} aria-label='Less buffer' onClick={() => change(-1)}>–</button>
         <span className='w-7 text-center font-semibold text-text-primary tabular-nums'>{settings.bufferMinutes}m</span>
         <button type='button' className={stepClass} aria-label='More buffer' onClick={() => change(1)}>+</button>
      </div>
   )
}
