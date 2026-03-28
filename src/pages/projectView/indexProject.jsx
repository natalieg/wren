import React, { useState } from 'react'
import DocWrapper from '../../components/DocWrapper'
import dark1 from '../../assets/img/dark1.jpg'
import ProjectPanel from './ProjectPanel'

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

    const ACCUMULATED = 'accumulated'
    const NUMBER = 'number'

    const dummyProjects = [
        {
            id: 1,
            title: 'Project Alpha',
            icon: '⩙',
            goaltype: ACCUMULATED,
            goalMetric: 'Pages',
            hourPerUnity: 0.5,
            progressType: ACCUMULATED,
            // progress: 750,
            deadline: true,
            deadlineDate: '20.08.2026',
            weeklyCommitment: 10,
            status: 3,
            subProjects: [
                {
                    id: 11,
                    title: 'Subproject Alpha-1',
                    icon: '⩙',
                    goaltype: ACCUMULATED,
                    goalMetric: 'Pages',
                    hourPerUnity: 0.5,
                    goal: 500,
                    progressType: ACCUMULATED,
                    progress: 100,
                    deadline: true,
                    deadlineDate: '15.05.2026',
                    weeklyCommitment: 5,
                    status: 2,
                    subProjects: [
                        {
                            id: 111,
                            title: 'Subproject Alpha-1-1',  
                            icon: '⩙',
                            goaltype: NUMBER,
                            goalMetric: 'Pages',
                            hourPerUnity: 0.5,
                            goal: 200,
                            progressType: NUMBER,
                            progress: 50,
                            deadline: true,
                            deadlineDate: '01.05.2026',
                            weeklyCommitment: 2,
                            status: 1,
                        },
                    ]
                },
                {
                    id: 12,
                    title: 'Subproject Alpha-2',
                    icon: '⩙',
                    goaltype: NUMBER,
                    goalMetric: 'Pages',
                    hourPerUnity: 0.5,
                    goal: 500,
                    progressType: NUMBER,
                    progress: 400,
                    deadline: true,
                    deadlineDate: '20.08.2026',
                    weeklyCommitment: 5,
                    status: 2,
                },
            ]
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
                    onClick={toggleGridView}>
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
