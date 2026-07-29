import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

const titleBarStyle = { background: 'linear-gradient(135deg, #a56bff, #f7719e)' }

// TODO test
export default function Modal({ title = 'wren.exe', width = 'w-80', onClose, children }) {
    useEffect(() => {
        const handleKeyDown = (e) => e.key === 'Escape' && onClose?.()
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    return createPortal(
        <div id='modalOverlay' className='fixed inset-y-0 right-0 left-(--sidebar-w) z-50 flex items-center justify-center bg-black/40' onClick={onClose}>
            <div
                className={`${width} overflow-hidden rounded-sm border-(length:--border-w-thick) border-text-primary bg-surface shadow-window-deep`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between px-2.5 py-1.5 font-retro text-lg text-white' style={titleBarStyle}>
                    <span>{title}</span>
                    <span className='flex gap-1.5'>
                        <span className='flex size-4 items-center justify-center rounded-[3px] bg-white/35 text-[11px]'>_</span>
                        <span className='flex size-4 items-center justify-center rounded-[3px] bg-white/35 text-[11px]'>□</span>
                        <span
                            className='flex size-4 cursor-pointer items-center justify-center rounded-[3px] bg-white/35 text-[11px]'
                            onClick={onClose}
                        >×</span>
                    </span>
                </div>
                <div className='p-4 font-body text-text-primary'>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}

Modal.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    children: PropTypes.node,
}
