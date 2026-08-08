import { NavLink } from 'react-router-dom'
import SidebarButton from '../components/elements/SidebarButton'
import flowers1 from '../assets/img/flowers1.jpg'
import { version } from '../../package.json'

export default function Sidebar({ className }) {
  return (
    <div className={`${className} sidebar flex flex-col gap-1 p-4`}
      style={{
        background: `
                linear-gradient(299deg,rgba(42, 123, 155, 1) 0%, 
                rgba(87, 199, 133, 1) 50%, 
                rgba(83, 163, 237, 1) 100%)
                `,
        backgroundColor: '#2A7B9B',
        backgroundImage: `url(${flowers1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      {/* <img src={bird3} alt="Bird" className="w-full mb-4 rounded-sm" /> */}
      <div className="w-full h-30 overflow-hidden mb-4">
        {/* <img src={mandala} alt="Mandala"
                    className="w-[200%] max-w-none -translate-x-[40%] translate-y-[-40%]" /> */}
        <div className='flex items-center justify-center h-full space-x-2 glow'>
          <span className='text-2xl transform -translate-y-1 -ml-4'>✨</span>
          <p className="text-center text-gold"
            style={{ fontFamily: 'Cinzel', fontSize: '1.5rem' }}>
            Wren <span style={{ fontSize: '1rem' }}>{version}</span>
          </p>
        </div>
      </div>
      <SidebarButton to="/">Home</SidebarButton>
      {/* //TODO */}
      <SidebarButton to="/backlog">Backlog</SidebarButton>
      <SidebarButton to="/history">History</SidebarButton>
      <br />
      <SidebarButton to="/trello">Trello</SidebarButton>
      <br />
      {/* <SidebarButton to="/project">[OLD] Projects</SidebarButton> */}
      <NavLink to="/settings"
        className="mt-auto text-center text-xs text-white/60 hover:text-white/90 py-1 transition-colors duration-200">
        Settings
      </NavLink>
    </div>
  )
}
