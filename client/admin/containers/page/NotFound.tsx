import * as React from "react";
import {Container} from "../../../common/components/Container";
import {Link} from "react-router-dom";
import {Box} from "@material-ui/core";

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
            <Container>
                <h2>404 not found.</h2>
                <hr/>
                <Box marginY={2}>
                    <Link to={"/"}>トップに戻る</Link>
                </Box>
            </Container>
        );
    }
}