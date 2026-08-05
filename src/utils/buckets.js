// shared backlog bucket definitions — order matters, it drives SwitchFlag cycling
// and which shift-arrow shows in Backlog.jsx (index bounds, not bucket names)
export const bucketOptions = [
    { value: 'nextUp', label: '🟢 Next Up' },
    { value: 'nextWeek', label: '🟡 Next Week' },
    { value: 'someday', label: '💤 Someday' },
]
