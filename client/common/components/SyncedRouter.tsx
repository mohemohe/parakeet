import React from "react"
import {Router} from "react-router-dom"
import type {History} from "history"

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