import * as React from "react";
import {Entries} from "../common/Entries";
import Container from "@material-ui/core/Container";

interface IProps extends React.ClassAttributes<{}> {
}

interface IState extends React.ComponentState {
}

export default class Index extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        return (
            <div>
                <h2>index</h2>

                <Container maxWidth={"lg"}>
                    <Entries/>
                </Container>

                <a href="/admin">admin</a>
            </div>
        );
    }
}