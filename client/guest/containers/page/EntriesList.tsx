import * as React from "react";
import {Entries} from "../common/Entries";
import {RouteComponentProps} from "react-router";

interface IProps extends RouteComponentProps<any> {
}

interface IState extends React.ComponentState {
}

export default class EntriesList extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        return (
            <>
                <Entries {...this.props}/>
            </>
        );
    }
}