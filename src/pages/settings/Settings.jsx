import DocWrapper from '../../components/DocWrapper'
import useSettings from '../../hooks/useSettings'
import InputRow from './InputRow'
import { hourToTimeValue, timeValueToHour } from '../../utils/rollover'
import CheckboxRow from './CheckboxRow'

export default function Settings() {
  const { settings, updateSetting } = useSettings()

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

  return (
    <DocWrapper header='Settings' className='w-full lg:w-1/2 xl:w-[40%] min-w-150 mx-auto'>
      <div className='flex flex-col gap-4 w-full max-w-[95%] mx-auto'>
        {/* Rollover Time — shown as a time field for consistency, but hours only:
            step snaps the picker, and dropping the minutes on the way back in means
            a typed 04:37 round-trips to 4 and redisplays as 04:00 */}
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

        <div className='mt-4 pt-4 border-t border-border-soft'>
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
