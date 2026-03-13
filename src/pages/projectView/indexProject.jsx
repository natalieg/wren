import React from 'react'
import DocWrapper from '../../components/DocWrapper'
import dark1 from '../../assets/img/dark1.jpg'
import Panel from '../../components/elements/Panel'

export default function IndexProject() {
    return (
        <DocWrapper
            background="#694159"
            style={{
                backgroundImage: `url(${dark1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            <p className="header">Project View</p>
            <Panel style={{ maxWidth: '90%' }}>
                <p className='text-lg h-40'>This is the project view. Here you can see all your projects and manage them.</p>
            </Panel>
        </DocWrapper>
    )
}
