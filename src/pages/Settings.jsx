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
            </div>
        </DocWrapper>
    )
}
