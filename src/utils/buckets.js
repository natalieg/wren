import { NEXTUP, NEXTWEEK, SOMEDAY } from './constants'

// shared backlog bucket definitions — order matters, it drives SwitchFlag cycling
// and which shift-arrow shows in Backlog.jsx (index bounds, not bucket names)
export const bucketOptions = [
    { value: NEXTUP, label: 'Next Up', emoji: '🟢' },
    { value: NEXTWEEK, label: 'Next Week', emoji: '🟡' },
    { value: SOMEDAY, label: 'Someday', emoji: '💤' },
]
