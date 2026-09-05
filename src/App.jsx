import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import Main from './pages/Main'
import Areas from './pages/areas'
import IndexProject from './pages/projectView/indexProject'
import Backlog from './pages/Backlog'
import History from './pages/history/History'
import Trello from './pages/trello/Trello'
import Settings from './pages/settings/Settings'
import Changelog from './pages/Changelog'
import TasksProvider from './context/TasksProvider'
import SettingsProvider from './context/SettingsProvider'
import HistoryProvider from './context/HistoryProvider'
import BreaksProvider from './context/BreaksProvider'
import FloatingTaskPanel from './components/FloatingTaskPanel'
import PausePanel from './components/PausePanel'

function App() {

   return (
      <SettingsProvider>
         <HistoryProvider>
            <BreaksProvider>
               <TasksProvider>
                  <div id='app' className='flex h-screen'>
                     <Sidebar className={'w-(--sidebar-w) shrink-0'} />
                     <div className='flex-1 overflow-auto' style={{ background: 'var(--color-bg-base)' }}>
                        <Routes>
                           <Route path='/' element={<Main />} />
                           <Route path='/areas' element={<Areas />} />
                           <Route path='/backlog' element={<Backlog />} />
                           <Route path='/history' element={<History />} />
                           <Route path='/trello' element={<Trello />} />
                           <Route path='/project' element={<IndexProject />} />
                           <Route path='/settings' element={<Settings />} />
                           <Route path='/changelog' element={<Changelog />} />
                        </Routes>
                     </div>
                     <FloatingTaskPanel />
                     <PausePanel />
                  </div>
               </TasksProvider>
            </BreaksProvider>
         </HistoryProvider>
      </SettingsProvider>
   )
}

export default App
