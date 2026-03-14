import React, { useState } from 'react'
import DocWrapper from '../../components/DocWrapper'
import dark1 from '../../assets/img/dark1.jpg'
import ProjectPanel from './ProjectPanel'

export default function IndexProject() {
    const [gridView, setGridView] = useState(true)

    return (
        <DocWrapper
            className="relative"
            background="#694159"
            style={{
                backgroundImage: `url(${dark1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            <p className="header">Project View</p>
            <div className="absolute top-4 right-4">
                <button id='switchViewBtn'
                    className='text-2xl text-gold w-12 cursor-pointer 
                    hover:text-shadow-md text-shadow-gold/80 transition-all duration-200'
                    onClick={() => setGridView(!gridView)}>
                    {gridView ? '⁝' : '⁜'}
                </button>
            </div>
            <div id='projectPanelList'
                className={`${gridView ? 'grid grid-cols-2' : 'flex flex-col'} gap-4`}>
                <ProjectPanel />
                <ProjectPanel />
                <ProjectPanel />
            </div>
        </DocWrapper>
    )
}
