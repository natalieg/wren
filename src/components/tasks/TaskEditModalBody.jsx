import Input from '../elements/Input'
import Textarea from '../elements/Textarea'
import Checkbox from '../elements/Checkbox'
import SwitchTag from '../elements/SwitchTag'
import MultiSwitchFlag from '../elements/MultiSwitchFlag'
import { bucketOptions } from '../../utils/buckets'
import { DONE, ACTIVE, BACKLOG } from '../../utils/constants'
import PlayBtn from '../elements/PlayBtn'
import { TimeFlagTracking } from '../elements/TimeFlag'
import { secondsToMinutes, minutesToSeconds } from '../../utils/formatTime'
import Bar from '../elements/Bar'

export default function TaskEditModalBody({ task, closeModal, isRunning, trackedSeconds, taskActions }) {
   const { id, label, time, trackedTime = 0 } = task
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
      e.preventDefault()
      e.stopPropagation()
      const newTrackedTime = parseInt(minutesToSeconds(e.target.value))
      handleFieldChange(id, 'trackedTime', newTrackedTime)
   }

   return (

      <div id={`taskEditModalBody_${id}`} className={`flex gap-2`}>

         <div className='flex flex-col gap-2 w-full'>
            <div className='flex flex-col pl-8 gap-2 w-full'>
               {/* Active/Inactive Tag + bucket, only relevant once parked */}
               <div className='pl-0 -mt-1 flex gap-2 items-center'>
                  {/* active/inactive */}
                  <SwitchTag label1='active' label2='inactive'
                     onClick={() => toggleActive(id)}
                     active={isActive} />
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

               {/* Progress Bar, tracked Time  */}
               {(thisTrackedTime > 0 || isRunning) &&
                  <div className='my-2'>
                     <Bar percent={thisTrackedTime / (time * 60) * 100} overflowEffect={true} />
                  </div>
               }
            </div>

            <div className='flex gap-2 items-start'>
               <div className='pt-2'>
                  <Checkbox id={id} onToggle={() => toggleDone(id)} checked={done} />
               </div>
               <Textarea
                  placeholder="Task description"
                  value={label}
                  onChange={(e) => handleFieldChange(id, 'label', e.target.value)}
                  onKeyDown={handleKeyDown}
               />
               <div id={`timeBox_${id}`} className='flex space-x-1'>
                  {/* Tracked Time  */}
                  <div>
                     {isRunning
                        ? <TimeFlagTracking tracked={thisTrackedTime}
                           onClick={stopTracking} />
                        : <Input
                           placeholder="0"
                           type="number"
                           width='w-16'
                           value={minutesTrackedTime}
                           onChange={handleTrackedTimeChange}
                           onKeyDown={handleKeyDown}
                        />
                     }
                  </div>
                  {/* Planned Time */}
                  <Input
                     placeholder="Time"
                     type="number"
                     width='w-14'
                     padding='px-2 py-0.5'
                     value={time}
                     onChange={(e) => handleFieldChange(id, 'time', parseInt(e.target.value))}
                     onKeyDown={handleKeyDown}
                     backgroundColor={isRunning ? (isTrackedMoreThanPlanned ? 'bg-red-200' : 'bg-green-200') : ''}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}
