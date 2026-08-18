import Textarea from '../elements/Textarea'
import Checkbox from '../elements/Checkbox'
import SwitchTag from '../elements/SwitchTag'
import MultiSwitchFlag from '../elements/MultiSwitchFlag'
import { bucketOptions } from '../../utils/buckets'
import { DONE, ACTIVE, BACKLOG } from '../../utils/constants'
import PlayBtn from '../elements/PlayBtn'
import { secondsToMinutes, minutesToSeconds, formatTimeWithSeconds } from '../../utils/formatTime'
import Bar from '../elements/Bar'
import LabeledField from '../elements/LabeledField'
import CheckboxCount from '../CheckboxCount'

//todo refine 'focus mode' styling
export default function TaskEditModalBody({ task, closeModal, isRunning, trackedSeconds, taskActions, className, focusMode }) {
   const { id, label, notes, time, trackedTime = 0 } = task
   const { handleFieldChange, toggleDone, toggleActive, startTracking, stopTracking } = taskActions
   const done = task.list === DONE
   const isBacklog = task.list === BACKLOG
   const isActive = task.list === ACTIVE
   const thisTrackedTime = trackedTime + (isRunning ? trackedSeconds : 0)
   const minutesTrackedTime = secondsToMinutes(thisTrackedTime)
   const isTrackedMoreThanPlanned = minutesTrackedTime > time

   const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()  //prevents \n in label
         closeModal()
      }
   }

   const handleTrackedTimeChange = (e) => {
      // parse first, then convert — the other way round relied on '5' * 60 coercing
      const minutes = parseInt(e.target.value) || 0
      handleFieldChange(id, 'trackedTime', minutesToSeconds(minutes))
   }

   // TODO check if this method should be put in taskActions, since it is a field change
   const handleToggleRecurring = () => {
      const newRecurring = task.recurring?.active
         ? { ...task.recurring, active: false }
         : { active: true, interval: 1, unit: 'day', id: task.recurring?.id || crypto.randomUUID() }
      handleFieldChange(id, 'recurring', newRecurring)
   }

   return (

      <div id={`taskEditModalBody_${id}`} className={`flex gap-2 max-w-200 mx-auto px-2 overflow-y-auto ${className || ''} ${focusMode ? 'h-[70vh]' : ''}`}>
         <div className={`flex flex-col w-full  ${focusMode ? 'gap-8 pt-4' : ' gap-2'}`}>
            <div className='flex flex-col pl-8 gap-1 w-full'>
               {/* Active/Inactive Tag + bucket, only relevant once parked */}
               <div className='pl-0 -mt-1 flex gap-2 items-center justify-between'>
                  <div className='flex gap-2 items-center'>
                     {/* Recurring TODO move to a different place in the modal 
                     - rework modal layout when more settings are here */}
                     <SwitchTag label1='↻' label2='●'
                        onClick={handleToggleRecurring}
                        active={task.recurring?.active}
                        title="Toggle Recurring" />
                     {/* active/inactive */}
                     <SwitchTag label1='active' label2='inactive'
                        onClick={() => toggleActive(id)}
                        active={isActive}
                        title="Active/Inactive" />
                     {isActive &&
                        <PlayBtn id={'toggleTracking_' + id}
                           backgroundColor={'bg-gradient-mutewarm'}
                           active={isRunning}
                           showAlways={true}
                           onClick={() => isRunning ? stopTracking() : startTracking(id)} />}
                     {/* bucket [next up, next week, someday...] */}
                     {isBacklog &&
                        <MultiSwitchFlag options={bucketOptions} value={task.backlog?.bucket} width='w-28'
                           onChange={(bucket) => handleFieldChange(id, BACKLOG, { ...task.backlog, bucket })} />}
                  </div>
                  <div id={`timeBox_${id}`} className='flex space-x-1 w-40'>
                     {/* Tracked Time — read-only while the timer runs, so a typed
                         value can't collide with the next failsafe flush */}
                     <LabeledField
                        id={`trackedTime_${id}`}
                        label="Tracked"
                        placeholder="0"
                        type="number"
                        width='w-16'
                        viewOnly={isRunning}
                        onClick={isRunning ? stopTracking : undefined}
                        value={isRunning ? formatTimeWithSeconds(thisTrackedTime) : minutesTrackedTime}
                        onChange={handleTrackedTimeChange}
                        onKeyDown={handleKeyDown}
                     />
                     {/* Planned Time */}
                     <LabeledField
                        id={`plannedTime_${id}`}
                        label="Planned"
                        placeholder="Time"
                        type="number"
                        width='w-14'
                        value={time}
                        onChange={(e) => handleFieldChange(id, 'time', parseInt(e.target.value) || 0)}
                        onKeyDown={handleKeyDown}
                        backgroundColor={isRunning ? (isTrackedMoreThanPlanned ? 'bg-failure-light' : 'bg-success-light') : ''}
                     />
                  </div>
               </div>

               {/* Progress Bar, tracked Time  */}
               {(thisTrackedTime > 0 || isRunning) &&
                  <div className='my-2'>
                     <Bar percent={thisTrackedTime / minutesToSeconds(time) * 100} overflowEffect={true} 
                     height={focusMode ? 'h-6' : 'h-2'}/>
                  </div>
               }
            </div>

            <div className='flex gap-2 items-start'>
               <div className='pt-2'>
                  <Checkbox id={id} onToggle={() => toggleDone(id)} checked={done} />
               </div>
               <div className='flex flex-col gap-2 w-full'>
                  <Textarea
                     placeholder="Task description"
                     value={label}
                     onChange={(e) => handleFieldChange(id, 'label', e.target.value)}
                     onKeyDown={handleKeyDown}
                  />
                  <label className='text-[14px] ml-2 -mb-2'>Notes</label>
                  {notes && notes?.length > 0 && <CheckboxCount text={notes} />}
                  <Textarea
                     placeholder="Add SubTasks with []"
                     value={notes}
                     onChange={(e) => handleFieldChange(id, 'notes', e.target.value)}
                     onKeyDown={handleKeyDown}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}
