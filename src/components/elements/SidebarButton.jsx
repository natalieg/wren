import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarButton({ to, children }) {
    return (
        <NavLink to={to}
            className="backdrop-blur-sm bg-white/10 border border-white/20
            rounded-lg px-4 py-2 text-white font-medium hover:bg-white/20 transition-colors duration-200">
            {children}
        </NavLink>
    )
}
