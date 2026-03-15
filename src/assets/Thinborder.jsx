import React from 'react'

export default function Thinborder({ children, className, position = 'top' }) {
  // switch case for all positions including 'full'
  const horizontalFade = 'mask-r-from-white mask-r-from-50% mask-r-to-black mask-l-from-white mask-l-from-50% mask-l-to-black'
  const verticalFade = 'mask-t-from-white mask-t-from-50% mask-t-to-black mask-b-from-white mask-b-from-50% mask-b-to-black'
  // TODO find a better solution for a more elegant full fade
  const fullFade = 'mask-r-from-white mask-r-from-95% mask-r-to-black mask-l-from-white mask-l-from-95% mask-l-to-black'

  let borderClass = ''
  switch (position) {
    case 'top': borderClass = 'border-t ' + horizontalFade; break
    case 'right': borderClass = 'border-r ' + verticalFade; break
    case 'bottom': borderClass = 'border-b ' + horizontalFade; break
    case 'left': borderClass = 'border-l ' + verticalFade; break
    case 'topBottom': borderClass = 'border-t border-b ' + horizontalFade; break
    case 'leftRight': borderClass = 'border-l border-r ' + verticalFade; break
    case 'full': borderClass = 'border ' + fullFade; break
    default: borderClass = 'border-t ' + horizontalFade; break
  }

  return (
    <div className={`full ${borderClass} border-gold ${className}
                mask-luminance`}>
      {children}
    </div>
  )
}
