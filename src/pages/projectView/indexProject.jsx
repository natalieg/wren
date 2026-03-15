import React, { useState } from 'react'
import DocWrapper from '../../components/DocWrapper'
import dark1 from '../../assets/img/dark1.jpg'
import ProjectPanel from './ProjectPanel'

export default function IndexProject() {
    const [gridView, setGridView] = useState(true)

    const dummyProjects = [
        {
            id: 1,
            title: 'Project Alpha',
            icon: '⩙',
            goaltype: 'Number',
            goalMetric: 'Pages',
            hourPerUnity: 0.5,
            goal: 1000,
            progress: 750,
            deadline: true,
            deadlineDate: '20.08.2026',
            weeklyCommitment: 10,
            status: 3,
        },
        {
            id: 2,
            title: 'Project Beta',
            icon: '⩥',
            goaltype: 'Number',
            goalMetric: 'Pages',
            hourPerUnity: 0.5,
            goal: 500,
            progress: 150,
            deadline: true,
            deadlineDate: '15.09.2026',
            weeklyCommitment: 5,
            status: 1,
        },
        {
            id: 3,
            title: 'Project Gamma',
            icon: '⩦',
            goaltype: 'Number',
            goalMetric: 'Pages',
            hourPerUnity: 0.5,
            goal: 840,
            progress: 750,
            deadline: true,
            deadlineDate: '15.09.2026',
            weeklyCommitment: 5,
            status: 2,
        }
    ]

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
                {dummyProjects.map(project => (
                    <ProjectPanel key={project.id} project={project} gridView={gridView} />
                ))}
            </div>
        </DocWrapper>
    )
}
