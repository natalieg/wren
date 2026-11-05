import { useEffect } from 'react'

// reloads state when another tab writes the same key, so tabs don't overwrite each other.
// parse must be stable (module-level), it's an effect dependency
function useStorageSync(key, setState, parse = JSON.parse) {
   useEffect(() => {
      const onStorage = (e) => {
         if (e.storageArea !== localStorage || e.key !== key || e.newValue === null) return
         try {
            setState(parse(e.newValue))
         } catch (err) {
            console.error(`Failed to sync ${key} from another tab:`, err)
         }
      }
      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
   }, [key, setState, parse])
}

export default useStorageSync
