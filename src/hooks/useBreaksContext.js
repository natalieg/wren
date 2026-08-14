import { useContext } from 'react'
import BreaksContext from '../context/BreaksContext'

// Reading the shared break-tracking state. 
function useBreaksContext() {
   const context = useContext(BreaksContext)
   if (!context) throw new Error('useBreaksContext must be used within a BreaksProvider')
   return context
}

export default useBreaksContext
