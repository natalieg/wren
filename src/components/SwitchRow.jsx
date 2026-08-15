import { useState } from 'react'
import SwitchTag from './elements/SwitchTag'

export default function SwitchRow({ array = [], onEdit, onChange, className }) {
   const [active, setActive] = useState(null)

   const handleClick = (item) => {
      if (active === item) {
         setActive(null)
      }
      else {
         setActive(item)
      }
      onChange(item)
   }

   return (
      <div className={`flex flex-wrap justify-center gap-2 ${className || ''}`}>
         {array.map((item, index) => (
            <SwitchTag key={index} label1={item} onClick={() => handleClick(item)}
               active={active === item} />
         ))}
      </div>
   )
}
