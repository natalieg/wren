import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarButton({ to, children }) {
    return (
        <NavLink to={to}
            className="button backdrop-blur-sm
            rounded-md px-4 py-2 font-medium transition-colors duration-200">
            {children}
        </NavLink>
    )
}
