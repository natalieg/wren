import { useState, useRef, useEffect } from 'react'
import { ModalMinimize } from './ModalIcons'

export default function FloatingPanel({ storageKey, width, height, visible = true, children, padding = 0, className = '', minimizable = false, handleMinimize }) {
   const [position, setPosition] = useState(() => {
      try {
         return JSON.parse(localStorage.getItem(storageKey)) ||
            { x: window.innerWidth - width, y: window.innerHeight - height }
      } catch (e) {
         return { x: window.innerWidth - width, y: window.innerHeight - height }
      }
   }) //default corner

   useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(position))
   }, [storageKey, position])

   const isDragging = useRef(false)

   // tracks offset of the pointer relative to the panel's top-left corner
   const dragOffset = useRef({ x: 0, y: 0 })

   const clamp = (x, y) => ({
      x: Math.max(0, Math.min(x, window.innerWidth - width)),
      y: Math.max(0, Math.min(y, window.innerHeight - height)),
   })

   const handlePointerDown = (e) => {
      isDragging.current = true
      dragOffset.current = {
         x: e.clientX - position.x,
         y: e.clientY - position.y,
      }
      // keeps sending pointermove/up to this element even once the cursor leaves it
      e.target.setPointerCapture(e.pointerId)
   }

   const handlePointerMove = (e) => {
      if (!isDragging.current) return
      // reverse of the offset math above: subtract it back
      setPosition(clamp(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
   }

   const handlePointerUp = (e) => {
      isDragging.current = false
      e.target.releasePointerCapture(e.pointerId)
   } 

   if (!visible) return null
   return (
      <div className={`bg-white rounded-md overflow-hidden shadow-lg ${className}`}
         style={{ position: 'fixed', left: position.x, top: position.y, }}>
         <div className={` flex justify-between items-center bg-gradient-softer px-2 w-full cursor-pointer border-b border-dark`
         }
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
            ⠿
            {minimizable && <ModalMinimize onMinimize={handleMinimize}/>}
            </div>
         <div className={` ${padding}`}>
            {children}
         </div>
      </div>
   ) 
}
