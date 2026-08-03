import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import Main from './pages/Main'
import IndexProject from './pages/projectView/indexProject'
import History from './pages/History'
// HINT (background timer fix): import { TasksProvider } from './context/TasksContext'

function App() {

  return (
    <div id='app' className='flex h-screen'>
      <Sidebar className={'w-(--sidebar-w) shrink-0'} />
      <div className='flex-1 overflow-auto' style={{background: 'var(--color-bg-base)'}}>
        {/* HINT: wrap <Routes> (not just <Main />) in <TasksProvider> here — that's
            what keeps useTasks() alive across route changes instead of remounting
            per-page. Tasklist.jsx then reads via useTasksContext() instead of
            calling useTasks() directly. */}
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/project' element={<IndexProject />} />
          <Route path='/history' element={<History />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
