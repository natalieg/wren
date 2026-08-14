import { useContext } from 'react'
import HistoryContext from '../context/HistoryContext'

// Reading the shared history state. 
function useHistoryContext() {
    const context = useContext(HistoryContext)
    if (!context) throw new Error('useHistoryContext must be used within a HistoryProvider')
    return context
}

export default useHistoryContext
