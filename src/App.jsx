import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import Main from './pages/Main'
import IndexProject from './pages/projectView/indexProject'
import History from './pages/History'
import TasksProvider from './context/TasksProvider'

function App() {

  return (
    <div id='app' className='flex h-screen'>
      <Sidebar className={'w-(--sidebar-w) shrink-0'} />
      <div className='flex-1 overflow-auto' style={{ background: 'var(--color-bg-base)' }}>
        <TasksProvider>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/project' element={<IndexProject />} />
            <Route path='/history' element={<History />} />
          </Routes>
        </TasksProvider>
      </div>
    </div>
  )
}

export default App
