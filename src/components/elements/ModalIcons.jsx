const iconStyle = 'flex size-4 items-center justify-center rounded-[3px] bg-white/35 text-[11px] cursor-pointer hover:bg-white/50'

export function ModalMinimize({ onMinimize }) {
   return (
      <span className={iconStyle}
         onClick={onMinimize}
      >_</span>
   )
}

export function ModalMaximize({ onMaximize }) {
   return (
      <span className={iconStyle}
         onClick={onMaximize}
      >□</span>
   )
}

export function ModalClose({ onClose }) {
   return (
      <span
         className={iconStyle}
         onClick={onClose}
      >×</span>
   )
}