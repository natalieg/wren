import React, { useState } from 'react'
import DocWrapper from '../../components/DocWrapper'
import dark1 from '../../assets/img/dark1.jpg'
import ProjectPanel from './ProjectPanel'
import { dummyProjects } from '../../utils/dummyData'
import Panel from '../../components/elements/Panel'

export default function IndexProject() {
    const [gridView, setGridView] = useState(() => {
        const saved = localStorage.getItem('gridView')
        return saved !== null ? JSON.parse(saved) : true
    })

    const toggleGridView = () => {
        setGridView(prev => {
            const next = !prev
            localStorage.setItem('gridView', JSON.stringify(next))
            return next
        })
    }

    const totalHours = dummyProjects.reduce((sum, p) => sum + (p.weeklyCommitment || 0), 0)

    return (
        <DocWrapper
            className="relative"
            background="#694159"
            style={{
                backgroundImage: `url(${dark1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            {/* button view switch */}
            <div className="absolute top-4 right-4">
                <button id='switchViewBtn'
                    className='text-2xl text-gold w-12 cursor-pointer 
                    hover:text-shadow-md text-shadow-gold/80 transition-all duration-200'
                    onClick={toggleGridView}>
                    {gridView ? '⁝' : '⁜'}
                </button>
            </div>
            <p className="header">Project View</p>
            <Panel className={'-mt-8 mb-4 flex flex-col items-center gap-1'}>
                <p className="text-gold/80 text-sm">
                    <span className='glow font-bold'>{dummyProjects.length}</span> Projects
                    <span className='mx-2'>◈</span>
                    <span className='glow font-bold'>{totalHours}</span> hours per week
                </p>
                <p className='text-gold/60 text-xs'>Est. <span className='font-bold text-gold/40 text-shadow-xs text-shadow-amber-300'>{totalHours / 5}</span> hours per workday</p>
            </Panel>
            <div id='projectPanelList'
                className={`${gridView ? 'grid grid-cols-2' : 'flex flex-col'} gap-4`}>
                {dummyProjects.map(project => (
                    <ProjectPanel key={project.id} project={project} gridView={gridView}
                        totalHours={totalHours} />
                ))}
            </div>
        </DocWrapper>
    )
}
