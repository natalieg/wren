import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import Main from './pages/Main'
import IndexProject from './pages/projectView/indexProject'
import Backlog from './pages/Backlog'
import History from './pages/History'
import TasksProvider from './context/TasksProvider'
import FloatingTaskPanel from './components/FloatingTaskPanel'

function App() {

  return (
    <TasksProvider>
      <div id='app' className='flex h-screen'>
        <Sidebar className={'w-(--sidebar-w) shrink-0'} />
        <div className='flex-1 overflow-auto' style={{ background: 'var(--color-bg-base)' }}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/backlog' element={<Backlog />} />
            <Route path='/history' element={<History />} />
            <Route path='/project' element={<IndexProject />} />
          </Routes>
        </div>
        <FloatingTaskPanel />
      </div>
    </TasksProvider>
  )
}

export default App
