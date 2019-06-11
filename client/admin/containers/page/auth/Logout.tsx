import * as React from "react";
import { style } from "typestyle";
import { Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { COLORS } from "../../../constants/Style";
import {AuthStore, AuthStatus} from "../../../stores/AuthStore";

interface IProps extends React.ClassAttributes<HTMLDivElement> {
    AuthStore?: AuthStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
        position: "absolute",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.DarkColor,
        color: COLORS.EmotionalWhite,
    }),
};

@inject("AuthStore")
@observer
export class LogoutPage extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.AuthStore!.logout();
    }

    public render() {
        if (this.props.AuthStore!.authStatus === AuthStatus.Unauthorized) {
            return <Redirect to="/"/>;
        }

        return (
            <div className={styles.root}>
                Logout...
            </div>
        );
    }
}