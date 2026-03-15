import React from 'react'

export default function Progressbar({ percentage, backgroundImage, className, height = 'h-4', status }) {
    const tintColor = status === 1 ? 'bg-red-500' : status === 2 ? 'bg-teal-500' : 'bg-green-500';

    const getMaskClass = (percentage) => {
        if (percentage >= 90) return ''
        if (percentage >= 80) return 'mask-r-from-90%'
        if (percentage >= 60) return 'mask-r-from-60%'
        return 'mask-r-from-20%'
    }

    return (
        <div id='progressBar'
            className={`relative ${height} overflow-hidden border-gold/40 border rounded-sm ${className}`}>
            <div className={`h-full absolute top-0 left-0
               ${tintColor}
                bg-blend-hard-light
                ${getMaskClass(percentage)}`}
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    width: `${percentage}%`
                }}></div>
            <div className='h-full bg-black'>
            </div>
        </div>
    )
}
