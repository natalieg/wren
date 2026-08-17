import PropTypes from 'prop-types'
import DotItem from '../components/elements/DotItem';

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


export function MultiProgressbar({ objectArray, height = 'h-4', className = '', markHighest = false }) {
   const allTime = objectArray.reduce((total, entry) => total + entry.value, 0)
   const barArray = objectArray.map(item => ({
      ...item,
      percentage: allTime > 0 ? (item.value / allTime) * 100 : 0
   }));
   const highestPercentage = markHighest ? Math.max(...barArray.map(item => item.percentage)) : null;

   return (
      <div className={`w-[70%] max-w-125 mx-auto ${className}`}>
         <div id='multiProgressBar' className={`${height} relative bg-gray-100 rounded-sm overflow-hidden flex w-full`}>
            {barArray.map((item, index) => (
               <div key={index} className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
            ))}
            <div className='pointer-events-none absolute inset-0 inset-shadow-sm inset-shadow-indigo-800/80 '></div>
         </div>
         <div className='flex mt-1 gap-3 flex-wrap items-center'>
            {barArray.map((obj, index) => (
               <DotItem
                  key={index}
                  label={obj.label}
                  value={obj.value}
                  color={obj.color}
                  percentage={obj.percentage > 0 ? obj.percentage : null}
                  special={markHighest && obj.percentage === highestPercentage}
               />
            ))}
         </div>
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