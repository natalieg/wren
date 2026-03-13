import React from 'react'
import { NavLink } from 'react-router-dom'
import SidebarButton from '../components/elements/SidebarButton'
import flowers1 from '../assets/img/flowers1.jpg'

export default function Sidebar({ className }) {
    return (
        <div className={`${className} sidebar flex flex-col gap-2 p-4`}
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
            <SidebarButton to="/">Home</SidebarButton>
            <SidebarButton to="/project">Projects</SidebarButton>
        </div>
    )
}
