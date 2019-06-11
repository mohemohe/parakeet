import * as React from "react";

interface IProps extends React.ClassAttributes<{}> {
}

interface IState extends React.ComponentState {
}

export class Index extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        return (
            <div>
                <h2>index</h2>
            </div>
        );
    }
}