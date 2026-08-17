import PropTypes, { object } from 'prop-types'

export default function Progressbar({ percentage, backgroundImage, className, height = 'h-4', fontSize, status }) {
   const tintColor = status === 1 ? 'bg-red-500' : status === 2 ? 'bg-teal-500/5' : 'bg-green-500';

   const getMaskClass = (percentage) => {
      if (percentage >= 90) return ''
      if (percentage >= 80) return 'mask-r-from-90%'
      if (percentage >= 60) return 'mask-r-from-60%'
      return 'mask-r-from-20%'
   }

   return (
      <div id='progressBar'
         className={`relative ${height} overflow-hidden border-gold/60 border rounded-sm ${className}`}>
         <div className='absolute inset-0 flex items-center justify-end text-gold/90 z-10 pr-2' style={{ fontSize }}>
            {parseInt(percentage)}%
         </div>
         <div className={`h-full absolute top-0 left-0
               ${tintColor}
                bg-blend-hard-light
                ${getMaskClass(percentage)}`}
            style={{
               backgroundImage: `url(${backgroundImage})`,
               backgroundSize: 'cover', backgroundPosition: 'center',
               width: `${percentage}%`
            }}></div>
         <div className='h-full bg-black'>
         </div>
      </div>
   )
}


export function MultiProgressbar({ objectArray, height = 'h-4' }) {

   const allTime = objectArray.reduce((total, entry) => total + entry.value, 0)
   console.log('alltime', allTime)

   // const barArray = objectArray.map(item => ({
   //    label: item.label,

   // });
   const barArray = objectArray.map(item => ({
      label: item.label,
      color: item.color,
      percentage: allTime > 0 ? (item.value / allTime) * 100 : 0
   }));

   return (
      <div className='w-[70%] mx-auto'>
         <div id='multiProgressBar' className={`${height} relative bg-gray-100 rounded-sm overflow-hidden flex w-full`}>
            {barArray.map((item, index) => (
               <div key={index} className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
            ))}
            <div className='pointer-events-none absolute inset-0 inset-shadow-sm inset-shadow-indigo-800/80 '></div>
         </div>
         {objectArray.map((obj, index) => (
            <span key={index}>{obj.label},{obj.value}---</span>
         ))}
      </div>
   )
}

MultiProgressbar.propTypes = {
   objectArray: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      value: PropTypes.number.isRequired,
   })).isRequired,
}