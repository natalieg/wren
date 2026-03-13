import React from 'react'
import DocWrapper from '../components/DocWrapper'

export default function Main({ className }) {
    return (
        <DocWrapper
            className={className}
            background="#1d4c59">
            <p className='header'>Main</p>
        </DocWrapper>
    )
}
