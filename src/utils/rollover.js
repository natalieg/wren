// shifts the day boundary from midnight to `rolloverHour` — e.g. with rolloverHour=4,
// 3:59am still counts as part of "yesterday", not a fresh day
export function logicalDayString(date, rolloverHour) {
    const shifted = new Date(date.getTime() - rolloverHour * 60 * 60 * 1000)
    return shifted.toDateString()
}

/** rolloverHour stays a plain int everywhere it's used — these two only exist so the
 * settings page can show it in an <input type='time'> next to defaultStartTime without
 * doing any time math itself. Minutes are dropped on the way back in, which is what
 * makes the field hours-only: typing 04:37 round-trips to 4 and redisplays as 04:00. */
// int <-> 'HH:mm', for the hours-only time field in settings
export const hourToTimeValue = (hour) => `${String(hour).padStart(2, '0')}:00`
export const timeValueToHour = (value) => Number(String(value).split(':')[0])
