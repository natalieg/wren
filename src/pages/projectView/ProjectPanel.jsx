import React from 'react'
import Panel from '../../components/elements/Panel'
import PropTypes from 'prop-types'
import galaxybar1 from '../../assets/img/galaxybar1.png'
import galaxybar2 from '../../assets/img/galaxybar2.png'
import Progressbar from '../../assets/Progressbar'
import Thinborder from '../../assets/Thinborder'

function ProjectCardGrid({ project }) {
    return (
        <Panel className="space-y-2">
            <p className="text-center text-gold text-xl" style={{ fontFamily: 'Cinzel' }}>
                {project.title}
            </p>
            <Thinborder position="bottom" />
            <Progressbar percentage={(project.progress / project.goal) * 100}
                backgroundImage={galaxybar2}
                status={project.status} />
        </Panel>
    )
}

function ProjectCardList({ project }) {
    return (
        <Panel>
            <div className="flex items-center gap-4">
                <span className='glow flex items-center justify-center w-8 transform -translate-y-0.5'
                    style={{ fontSize: '1.5rem' }}>
                    {project.icon}
                </span>
                <span className="w-80 text-gold"
                    style={{ fontFamily: 'Cinzel', fontSize: '1.3rem', lineHeight: '0' }}>
                    {project.title}
                </span>
                {/* <Thinborder position="right" className="h-5" /> */}
                <span className='text-gold glow'>⁛</span>
                <div className='min-w-80'>
                    <Progressbar percentage={(project.progress / project.goal) * 100}
                        backgroundImage={galaxybar2} height="h-8"
                        status={project.status} />
                </div>
            </div>
        </Panel>
    )
}

// Default export entscheidet welche Version
export default function ProjectCard({ project, gridView }) {
    return gridView
        ? <ProjectCardGrid project={project} />
        : <ProjectCardList project={project} />
}

ProjectCard.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        goaltype: PropTypes.string.isRequired,
        goalMetric: PropTypes.string,
        hourPerUnity: PropTypes.number,
        goal: PropTypes.number.isRequired,
        progress: PropTypes.number,
        deadline: PropTypes.bool.isRequired,
        deadlineDate: PropTypes.string,
        weeklyCommitment: PropTypes.number,
    }).isRequired,
}
