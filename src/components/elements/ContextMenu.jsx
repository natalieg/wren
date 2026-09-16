import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

export default function ContextMenu({ x, y, items, onClose }) {
   useEffect(() => {
      const handleKeyDown = (e) => e.key === 'Escape' && onClose?.()
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
   }, [onClose])

   return createPortal(
      <div className='fixed inset-0 z-50' onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose?.() }}>
         <div
            className='absolute min-w-40 rounded-sm border-(length:--border-w-thick) border-text-primary bg-surface shadow-window-deep py-1'
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
         >
            {items.map((item) => (
               <button key={item.label} className='block w-full px-3 py-1.5 text-left hover:bg-black/10'
                  onClick={() => { item.onClick(); onClose() }}>
                  {item.label}
               </button>
            ))}
         </div>
      </div>,
      document.body
   )
}

ContextMenu.propTypes = {
   x: PropTypes.number,
   y: PropTypes.number,
   items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func })),
   onClose: PropTypes.func,
}
