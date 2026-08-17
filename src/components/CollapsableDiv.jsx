import { useState } from 'react'
import { Divider } from './elements/Divider'

export default function CollapsableDiv({ label, children, collapseAction, defaultOpen = false }) {
   const [collapsed, setCollapsed] = useState(!defaultOpen)

   const handleClick = () => {
      setCollapsed(!collapsed)
      if (collapseAction && collapsed) {
         collapseAction()
      }
   }

   return (
      <div className='flex flex-col gap-2 mt-4 select-none'>
         <div className='cursor-pointer' onClick={handleClick}>
            <Divider label={label} glyph={collapsed ? '✧' : '✦'} />
         </div>
         <div
            className='grid transition-[grid-template-rows] duration-(--dur-base) ease-out'
            style={{ gridTemplateRows: collapsed ? '0fr' : '1fr', overflow: collapsed ? 'hidden' : 'visible' }}
         >
            <div className='min-h-0'>
               {children}
               <Divider />
            </div>
         </div>
      </div>
   )
}
