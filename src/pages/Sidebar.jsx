import { NavLink } from 'react-router-dom'
import SidebarButton from '../components/elements/SidebarButton'
import darkFern from '../assets/img/darkFern.jpg'
import logo from '../assets/img/Logo_Wren.png'
import { version } from '../../package.json'

const footerLink = "text-center text-xs text-white/60 hover:text-white/90 py-1 transition-colors duration-200"

export default function Sidebar({ className }) {
   return (
      <div className={`${className} sidebar flex flex-col gap-1 p-4`}
         style={{
            // backgroundImage: 'var(--bg-sidebar-gradient)',
            // backgroundColor: 'var(--bg-sidebar)',
            backgroundColor: 'var(--bg-sidebar)',
            backgroundImage: `url(${darkFern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
         }}>
         <div className="w-full h-30 overflow-hidden mb-4">
            {/* <img src={mandala} alt="Mandala"
                    className="w-[200%] max-w-none -translate-x-[40%] translate-y-[-40%]" /> */}
            <div className='flex flex-col items-center justify-center h-full -space-y-6 glow'>
               {/* <span className='text-2xl transform -translate-y-1 -ml-4'>✨</span> */}
               <img src={logo} alt="Logo" className="h-full logo-glow" />
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
         <div className="mt-auto flex flex-col">
            <NavLink to="/settings" className={footerLink}>Settings</NavLink>
            <NavLink to="/changelog" className={footerLink}>Changelog</NavLink>
         </div>
      </div>
   )
}
