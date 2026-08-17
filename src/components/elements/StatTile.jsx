export default function StatTile({ value, label, valueClassName }) {
   return (
      <div className='flex-1 rounded-xl bg-accent-soft/20 px-3 py-2 text-center'>
         <div className={`text-lg font-semibold ${valueClassName}`}>{value}</div>
         <div className='text-xs text-text-muted'>{label}</div>
      </div>
   )
}