// Sums a day's logged break sessions by type. Sessions are snapshotted with
// name/emoji at break-stop time, so if a type got renamed mid-day, this keeps
// whichever session came first.
export function breakTimeByType(breaks = []) {
   const totals = new Map()
   for (const b of breaks) {
      const existing = totals.get(b.type)
      if (existing) {
         existing.duration += b.trackedTime
      } else {
         totals.set(b.type, { type: b.type, name: b.name, emoji: b.emoji, color: b.color, duration: b.trackedTime })
      }
   }
   return [...totals.values()]
}
