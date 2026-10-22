import { useState, useEffect } from 'react'
import { newTaskId } from '../utils/taskId'

export const SHORTLIST_STORAGE_KEY = 'shortlist'

// little things jotted down to grab when the day runs empty: [{ id, label }, ...]
function useShortlist() {
   const [shortlist, setShortlist] = useState(() => {
      try {
         const saved = localStorage.getItem(SHORTLIST_STORAGE_KEY)
         return saved ? JSON.parse(saved) : []
      } catch (e) {
         console.error('Failed to load shortlist from localStorage:', e)
         return []
      }
   })

   useEffect(() => {
      localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(shortlist))
   }, [shortlist])

   const addToShortlist = (label) => {
      if (!label?.trim()) return
      setShortlist(current => [...current, { id: newTaskId(), label: label.trim() }])
   }

   const removeFromShortlist = (id) => {
      setShortlist(current => current.filter(item => item.id !== id))
   }

   return { shortlist, addToShortlist, removeFromShortlist }
}

export default useShortlist
