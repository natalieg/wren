import { useContext } from 'react'
import TrackingContext from '../context/TrackingContext'

// The coordinated start/stop actions — the ones that enforce "only one thing runs
// at a time". Task components reach the same functions through taskActions;
// anything on the break side (PausePanel) goes through here.
function useTrackingContext() {
    const context = useContext(TrackingContext)
    if (!context) throw new Error('useTrackingContext must be used within a TasksProvider')
    return context
}

export default useTrackingContext
