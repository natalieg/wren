import React from 'react'
import DocWrapper from '../components/DocWrapper'
import Tasklist from './Tasklist'

export default function Main({ className }) {
    return (
        <DocWrapper
            className={className}
            background="var(--color-bg-base)">
            <Tasklist />
        </DocWrapper>
    )
}
