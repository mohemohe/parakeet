import * as React from 'react'
import {Router} from 'react-router-dom'
import {History} from 'history'

export interface IProps {
    history: History
}

export class SyncedRouter extends React.Component<IProps, {}> {
    render () {
        return (
            <Router history={this.props.history} children={this.props.children}/>
        )
    }
}