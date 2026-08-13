import { useState } from 'react'
import FloatingPanel from './elements/FloatingPanel'
import EmojiMiniCard from './elements/EmojiMiniCard'


// TODO visibility from settings
export default function PausePanel({ className }) {
   const [miniState, setMiniState] = useState(false)

   const pauseTypes = [{ id: 1, name: 'pause', emoji: '🍵' },
   { id: 2, name: 'gaming', emoji: '🎮' },
   { id: 3, name: 'social', emoji: '🫂' }]

   return (
      <FloatingPanel storageKey='floatingPausePanelPosition' width={100} height={70} padding='p-2'
         visible={true} className={className} minimizable={true} handleMinimize={() => setMiniState(!miniState)}>
         {miniState ? <div onClick={() => setMiniState(false)} className='text-2xl cursor-pointer'>
            🍵
         </div>
            :
            <div className='flex flex-col gap-2'>
               PausePanel
               {pauseTypes.map(pauseType => (
                  <EmojiMiniCard
                     key={pauseType.id}
                     id={pauseType.id}
                     title={pauseType.name}
                     emoji={pauseType.emoji}
                     onClick={() => { }} />
               ))}
            </div>}
      </FloatingPanel>
   )
}
