import React from 'react'
import Panel from '../../components/elements/Panel'
import PropTypes from 'prop-types'
import galaxybar2 from '../../assets/img/galaxybar2.png'
import Progressbar from '../../assets/Progressbar'
import Thinborder from '../../assets/Thinborder'
import { computeGoal, computeProgress, flattenGoals } from '../../utils/projectUtils'
import TitleWithIcon from '../../components/elements/TitleWithIcon'

/**
 * Two layouts for grid and list view 
 */

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
    const rows = flattenGoals(project)

    return (
        <Panel>
            <div className="grid gap-y-2" style={{ gridTemplateColumns: '1fr auto' }}>
                {rows.map((item, i) => {
                    const percentage = computeGoal(item) > 0 ? (computeProgress(item) / computeGoal(item)) * 100 : 0
                    return (
                        <React.Fragment key={i}>
                            <div className=""
                                style={{ paddingLeft: `${item.depth * 1.5}rem` }}>
                                <TitleWithIcon item={item} index={i} />
                                {/* Goal and Progress */}
                                <div className={`-mt-2 pl-7`}>
                                    <span className='text-gold/60 text-sm'>
                                        {computeProgress(item)}/{computeGoal(item)} {item.goalMetric}
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 pl-4'>
                                <span className='text-gold glow'>⁛</span>
                                <div className='w-80'>
                                    <Progressbar
                                        percentage={percentage}
                                        backgroundImage={galaxybar2}
                                        height={item.depth === 0 ? 'h-8' : 'h-6'}
                                        fontSize={item.depth === 0 ? '1rem' : '0.75rem'}
                                        status={item.status} />
                                </div>
                            </div>
                        </React.Fragment>
                    )
                })}
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
