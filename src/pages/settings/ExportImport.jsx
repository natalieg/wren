import { useState } from 'react'
import { exportData, importData } from '../../utils/backup'
import { formatDateWithTime } from '../../utils/formatTime'
import CollapsableDiv from '../../components/CollapsableDiv'

export default function ExportImport() {
   const [exportDate, setExportDate] = useState(localStorage.getItem('exportDate'))

   const handleExport = () => {
      exportData()
      const exportDate = localStorage.getItem('exportDate')
      setExportDate(exportDate ? formatDateWithTime(exportDate) : null)
   }

   const calcDaysSinceExport = () => {
      if (!exportDate) return null
      const exportDateObj = new Date(exportDate)
      const now = new Date()
      const diffTime = Math.abs(now - exportDateObj)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
   }

   const isLastExportOlderThan7Days = () => {
      const daysSinceExport = calcDaysSinceExport()
      return daysSinceExport !== null && daysSinceExport > 7
   }

   return (
      <CollapsableDiv label='Export / Import Data' defaultOpen={false}>
         <div className='flex flex-col gap-4 items-center justify-center py-4'>
            <div className='flex gap-2 items-center justify-center'>
               <button type='button' onClick={handleExport} className='softButton'>Export Data</button>
               <span className='text-text-primary/60'>◆</span>
               <label htmlFor='importFile' className='softButton'>Import Data</label>
               <input type='file' id='importFile' accept='.json' onChange={(e) => importData(e.target.files[0])} className='hidden' />
            </div>
            {isLastExportOlderThan7Days() &&
               <div className='text-text-primary text-center'>Last export is {calcDaysSinceExport()} days ago, consider exporting your data now.</div>}
            <div className='text-center text-text-primary/50'>{exportDate ? `Last export: ${exportDate}` : 'No export yet'}</div>
         </div>
      </CollapsableDiv>
   )
}
