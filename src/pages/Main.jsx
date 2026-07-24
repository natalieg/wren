import React from 'react'
import DocWrapper from '../components/DocWrapper'
import Today from './Today'

export default function Main({ className }) {
    return (
        <DocWrapper
            className={className}
            background="var(--bg-base)">
            <Today />
        </DocWrapper>
    )
}
