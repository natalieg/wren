import React, { useState } from 'react'
import { Divider } from './elements/Divider'

export default function CollapsableDiv({ label, children }) {
    const [collapsed, setCollapsed] = useState(true)

    return (
        <div className='flex flex-col gap-2 mt-4 select-none'>
            <div className='cursor-pointer' onClick={() => setCollapsed(!collapsed)}>
                <Divider label={label} glyph={collapsed ? '✧' : '✦'} />
            </div>
            <div
                className='grid overflow-hidden transition-[grid-template-rows] duration-(--dur-base) ease-out'
                style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
            >
                <div className='min-h-0'>
                    {children}
                </div>
            </div>
        </div>
    )
}
