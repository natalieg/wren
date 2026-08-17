// Keys that make up a full backup. Deliberately excludes 'breakDurations'
// (resets daily, not worth restoring) and 'gridView' (throwaway UI toggle).
export const BACKUP_KEYS = ['history', 'tasks', 'settings', 'startedAt', 'trelloCredentials']

export function exportData() {

   const loadBackupData = () => {
      const result = {}
      BACKUP_KEYS.forEach(key => {
         try {
            const jsonData = localStorage.getItem(key)
            if (jsonData) {
               result[key] = JSON.parse(jsonData)
            }
         } catch (error) {
            console.error('Failed to load from localStorage from key: ', key, error)
         }
      })
      return result
   }

   const backupData = loadBackupData()
   const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
   const url = URL.createObjectURL(blob)
   const a = document.createElement('a')
   document.body.appendChild(a)
   a.href = url
   const today = new Date().toISOString().split('T')[0]
   a.download = `wrenBackup_${today}.json`
   a.click()
   a.remove()
   URL.revokeObjectURL(url)

   localStorage.setItem('exportDate', new Date().toISOString())
}

const CORE_KEYS = ['tasks', 'settings', 'history',] // core keys that should never change 
// checks core keys and type of each value
const isValidBackup = (data) => {
   if (typeof data !== 'object' || data === null || Array.isArray(data)) return false
   if (!CORE_KEYS.every(key => key in data)) return false
   if (!Array.isArray(data.tasks)) return false
   if (!Array.isArray(data.history)) return false
   if (typeof data.settings !== 'object' || data.settings === null || Array.isArray(data.settings)) return false

   return true
}

export function importData(file) {
   if (!file) return
   const reader = new FileReader()
   reader.onload = e => {
      try {
         const data = JSON.parse(e.target.result)
         if (!isValidBackup(data)) throw new Error();
         if (!confirm(`Import Backup? Current Data will be overwritten.`)) return;
         BACKUP_KEYS.forEach(key => {
            if (key in data) {
               localStorage.setItem(key, JSON.stringify(data[key]))
            }
         })
         alert('Import successful! Wren will now reload.')
         window.location.reload()
      } catch {
         alert('Import failed - is this file a valid Wren file?')
      }
   }
   reader.readAsText(file)
}
