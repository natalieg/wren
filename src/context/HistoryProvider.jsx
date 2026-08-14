import HistoryContext from './HistoryContext'
import useHistory from '../hooks/useHistory'

// One shared useHistory() instance. Writers (tasks finishing, breaks stopping) and
// readers (the History page) have to sit on the same state — separate useHistory()
// calls each hold their own copy and only catch up when they remount.
function HistoryProvider({ children }) {
    const historyValue = useHistory()

    return <HistoryContext.Provider value={historyValue}>
        {children}
    </HistoryContext.Provider>
}

export default HistoryProvider
