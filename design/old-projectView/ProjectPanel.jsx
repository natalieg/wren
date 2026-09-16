import React from 'react'
import Panel from '../../components/elements/Panel'
import PropTypes from 'prop-types'
import galaxybar2 from '../../assets/img/galaxybar2.png'
import Progressbar from '../../assets/Progressbar'
import Thinborder from '../../assets/Thinborder'
import { computeGoal, computeProgress, flattenGoals, getBadgeColor } from '../../utils/projectUtils'
import TitleWithIcon from '../../components/elements/TitleWithIcon'

/**
 * Two layouts for grid and list view 
 */

// GRIDVIEW
function ProjectCardGrid({ project }) {
    const goal = computeGoal(project)
    const progress = computeProgress(project)
    const percentage = goal > 0 ? (progress / goal) * 100 : 0

    return (
        <Panel className="space-y-2">
            <p className="text-center text-gold text-xl" style={{ fontFamily: 'Cinzel' }}>
                {project.title}
            </p>
            <Thinborder position="bottom" />
            <Progressbar percentage={percentage}
                backgroundImage={galaxybar2}
                status={project.status} />
        </Panel>
    )
}

// LISTVIEW
function ProjectCardList({ project, totalHours }) {
    const rows = flattenGoals(project)

    return (
        <Panel>
            <div className="grid gap-y-2" style={{ gridTemplateColumns: '1fr auto' }}>
                {rows.map((item, i) => {
                    const percentage = computeGoal(item) > 0 ? (computeProgress(item) / computeGoal(item)) * 100 : 0
                    const topGoal = item.depth === 0
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
                            <div className='flex items-center gap-3 pl-4'>
                                {/* Commitment Info */}
                                <div className='flex gap-2 w-16'>
                                    {topGoal && item.weeklyCommitment > 0 && (
                                        <div className={`${getBadgeColor(item.weeklyCommitment, totalHours)}  flex items-center justify-center rounded-sm px-1 py-0.5 gap-1 border`}>
                                            <span className='text-gold glow'>⁛</span>
                                            <div className='flex flex-col justify-center items-center'>
                                                <div className='text-gold text-sm'>{item.weeklyCommitment}h</div>
                                                <div className='text-gold/60 text-[10px] -pt-2 -mt-0.5'>weekly</div>
                                            </div>
                                            <span className='text-gold glow'>⁛</span>
                                        </div>
                                    )}
                                </div>
                                <div className='w-80'>
                                    <Progressbar
                                        percentage={percentage}
                                        backgroundImage={galaxybar2}
                                        height={topGoal ? 'h-[39px]' : 'h-6'}
                                        fontSize={topGoal ? '1rem' : '0.75rem'}
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
export default function ProjectCard({ project, gridView, totalHours }) {
    return gridView
        ? <ProjectCardGrid project={project} totalHours={totalHours} />
        : <ProjectCardList project={project} totalHours={totalHours} />
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
