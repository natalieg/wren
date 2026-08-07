import DocWrapper from '../components/DocWrapper'
import useSettings from '../hooks/useSettings'
import Input from '../components/elements/Input'
import Checkbox from '../components/elements/Checkbox'

export default function Settings() {
    const { settings, updateSetting } = useSettings()

    const handleRolloverHourChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value >= 0 && value <= 23) updateSetting('rolloverHour', value)
    }

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
                <div className='flex items-center justify-between gap-2'>
                    <label htmlFor='rolloverHour'>Rollover time (hour, 0-23)</label>
                    <Input id='rolloverHour' type='number' width='w-20'
                        value={settings.rolloverHour}
                        onChange={handleRolloverHourChange} />
                </div>
                <div className='flex items-center gap-2'>
                    <Checkbox id='rolloverActive' checked={settings.rolloverActive}
                        onToggle={() => updateSetting('rolloverActive', !settings.rolloverActive)} />
                    <label htmlFor='rolloverActive'>Auto-activate &apos;Next up&apos; tasks at rollover</label>
                </div>

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
