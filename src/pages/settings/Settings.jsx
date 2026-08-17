import DocWrapper from '../../components/DocWrapper'
import useSettingsContext from '../../hooks/useSettingsContext'
import InputRow from './InputRow'
import { hourToTimeValue, timeValueToHour } from '../../utils/rollover'
import CheckboxRow from './CheckboxRow'
import SoundPickerRow from './SoundPickerRow'
import { timerSoundIds, FINISHED_SOUND_ID } from '../../utils/sounds'
import DragBar from '../../components/elements/DragBar'
import { Divider } from '../../components/elements/Divider'
import Input from '../../components/elements/Input'
import DeleteFlag from '../../components/elements/DeleteFlag'
import Button from '../../components/elements/Button'
import ExportImport from './ExportImport'

export default function Settings() {
   const { settings, updateSetting } = useSettingsContext()

   // DEV DEBUG , delete later
   // pushes 'startedAt' 25h into the past (always crosses at least one logical day,
   // regardless of current time or rolloverHour) and reloads, so the real once-per-mount
   // rollover check in useTasks.js runs the exact same way it would after an actual
   // overnight gap — no separate test-mode code path to keep in sync
   const simulateRollover = () => {
      const past = new Date(Date.now() - 25 * 60 * 60 * 1000)
      localStorage.setItem('startedAt', past.toISOString())
      window.location.reload()
   }

   const toggleBreakType = (id) => {
      updateSetting('breakTypes', settings.breakTypes.map(b =>
         b.id === id ? { ...b, enabled: !b.enabled } : b
      ))
   }

   const updateBreakTime = (index, value) => {
      const newBreakTimes = [...settings.breakTimes]
      newBreakTimes[index] = parseInt(value, 10)
      updateSetting('breakTimes', newBreakTimes)
   }

   const addBreakTime = () => {
      const highestBreakTime = Math.max(...settings.breakTimes)
      const suggestedNewTime = Math.round(highestBreakTime + highestBreakTime / 2)
      updateSetting('breakTimes', [...settings.breakTimes, suggestedNewTime])
   }

   const deleteBreakTime = (index) => {
      if (settings.breakTimes.length > 1) {
         const newBreakTimes = [...settings.breakTimes]
         newBreakTimes.splice(index, 1)
         updateSetting('breakTimes', newBreakTimes)
      }
   }

   return (
      <DocWrapper header='Settings' className='w-full lg:w-1/2 xl:w-[40%] min-w-150 mx-auto'>
         <div className='flex flex-col gap-4 w-full max-w-[95%] mx-auto'>
            {/* Rollover Time — shown as a time field for consistency, but hours only:
            step snaps the picker, and dropping the minutes on the way back in means
            a typed 04:37 round-trips to 4 and redisplays as 04:00 */}
            <Divider label='Rollover' />
            <InputRow label='Rollover time (hour)' id='rolloverHour' type='time' step={3600}
               value={hourToTimeValue(settings.rolloverHour)}
               onChange={(e) => updateSetting('rolloverHour', timeValueToHour(e.target.value))} />
            {/* Default start time */}
            <InputRow id='defaultStartTime' label='Default start time' type='time'
               value={settings.defaultStartTime}
               onChange={(e) => updateSetting('defaultStartTime', e.target.value)} />
            {/* Check: Task Rollover */}
            <CheckboxRow id='rolloverActive' checked={settings.rolloverActive}
               onToggle={() => updateSetting('rolloverActive', !settings.rolloverActive)}
               label="Auto-activate &apos;Next up&apos; tasks at rollover" />
            {/* Check: Finished Task Deletion */}
            <CheckboxRow id='autoDeleteFinished' checked={settings.autoDeleteFinished}
               onToggle={() => updateSetting('autoDeleteFinished', !settings.autoDeleteFinished)}
               label="Auto-delete finished tasks at rollover" />

            <Divider label='Breaks' />

            <div className='mb-2'>
               <p className='text-xs text-text-muted mb-2'>Break types</p>
               <div className='flex gap-2'>
                  {settings.breakTypes.map(breakType => (
                     <CheckboxRow key={breakType.id} id={`breakType-${breakType.id}`}
                        checked={breakType.enabled}
                        onToggle={() => toggleBreakType(breakType.id)}
                        label={`${breakType.emoji} ${breakType.name}`} />
                  ))}
               </div>

               <p className='text-xs text-text-muted mt-6'>Default break duration</p>
               <div className='flex flex-wrap items-center gap-2'>
                  {settings.breakTimes.map((breakTime, index) => (
                     <DeleteFlag key={index} deleteEnabled={settings.breakTimes.length > 1}
                        onClick={() => deleteBreakTime(index)}>
                        <Input key={index} id={`breakTime-${breakTime}`} slim
                           type='number' min={1} step={1}
                           width='w-16'
                           value={breakTime}
                           onChange={(e) => updateBreakTime(index, e.target.value)} />
                     </DeleteFlag>
                  ))}
                  <Button label='+' onClick={addBreakTime} className='px-3 py-0.5 text-lg' />
               </div>
            </div>

            <Divider label='Sound' />

            {/* Timer sound — plays when a running task passes its time estimate */}
            <SoundPickerRow id='timerSound' label='Timer sound' value={settings.timerSound}
               options={timerSoundIds} onChange={(value) => updateSetting('timerSound', value)}
               enabled={settings.timerSoundEnabled}
               onToggleEnabled={() => updateSetting('timerSoundEnabled', !settings.timerSoundEnabled)} />

            {/* Break sound — plays when a running task passes its time estimate */}
            <SoundPickerRow id='breakSound' label='Break sound' value={settings.breakSound}
               options={timerSoundIds} onChange={(value) => updateSetting('breakSound', value)}
               enabled={settings.breakSoundEnabled}
               onToggleEnabled={() => updateSetting('breakSoundEnabled', !settings.breakSoundEnabled)} />

            {/* Finished sound — fixed sound, just toggled on/off */}
            <SoundPickerRow id='finishedSoundEnabled' label='Play sound when a task finishes'
               value={FINISHED_SOUND_ID}
               enabled={settings.finishedSoundEnabled}
               onToggleEnabled={() => updateSetting('finishedSoundEnabled', !settings.finishedSoundEnabled)} />

            {/* Volume for all sounds*/}
            <div className='flex items-center justify-between gap-2'>
               <label htmlFor='soundVolume'>Sound volume</label>
               <DragBar value={settings.soundVolume}
                  onChange={(value) => updateSetting('soundVolume', value)} />
            </div>

            <ExportImport />
            {/* DEBUG */}
            <div className='mt-1 pt-4 border-t border-border-soft'>
               <p className='text-xs text-text-muted mb-2'>Developer</p>
               <button type='button' onClick={simulateRollover}
                  className='softButton'>
                  Simulate next rollover (reloads the page)
               </button>
            </div>
         </div>
      </DocWrapper>
   )
}
