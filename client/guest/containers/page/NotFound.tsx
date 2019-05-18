import * as React from "react";

interface IProps extends React.ClassAttributes<{}> {
}

interface IState extends React.ComponentState {
}

export default class Notfound extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        return (
            <div>
                <h2>404 not found.</h2>
                <hr/>
            </div>
        );
    }
}