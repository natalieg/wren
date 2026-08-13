import { useContext } from 'react'
import BreaksContext from './BreaksContext'
import HistoryContext from './HistoryContext'
import useBreakTracking from '../hooks/useBreakTracking'

// history > brakProvider to use history for writing breakTime 
function BreaksProvider({ children }) {
    const { addBreakToHistory } = useContext(HistoryContext)
    const breaksValue = useBreakTracking({ onBreakFinished: addBreakToHistory })

    return <BreaksContext.Provider value={breaksValue}>
        {children}
    </BreaksContext.Provider>
}

export default BreaksProvider
