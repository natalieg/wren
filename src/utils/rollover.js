// shifts the day boundary from midnight to `rolloverHour` — e.g. with rolloverHour=4,
// 3:59am still counts as part of "yesterday", not a fresh day
export function logicalDayString(date, rolloverHour) {
    const shifted = new Date(date.getTime() - rolloverHour * 60 * 60 * 1000)
    return shifted.toDateString()
}
