import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import Main from './pages/Main'
import IndexProject from './pages/projectView/indexProject'

function App() {

  return (
    <div id='app' className='flex h-screen'>
      <Sidebar className={'w-64 shrink-0'} />
      <div className='flex-1 overflow-auto' style={{background: '#694159'}}>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/project' element={<IndexProject />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
