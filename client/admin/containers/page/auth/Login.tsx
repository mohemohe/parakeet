import * as React from "react";
import { style } from "typestyle";
import { Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, CardActions, CardContent, Button, Typography, TextField } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { COLORS } from "../../../constants/Style";
import {AuthStore, AuthStatus} from "../../../stores/AuthStore";

interface IProps extends React.ClassAttributes<HTMLDivElement> {
    AuthStore?: AuthStore;
}

interface IState extends React.ComponentState {
    name: string;
    password: string;
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
    headerBar: {
        width: "100vw",
    },
    loginCardWrapper: style({
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
    }),
    loginCard: style({
        backgroundColor: COLORS.EmotionalWhite,
        color: "#000000",
        width: 400,
        padding: 40,
        display: "flex",
        flexDirection: "column",
    }),
    loginActions: style({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: COLORS.EmotionalBlack,
        alignItems: "center",
        flex: 1,
    }),
    loginInputs: style({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: COLORS.EmotionalBlack,
        alignItems: "center",
        flex: 1,
    }),
    loginButtons: style({
        display: "flex",
        flexDirection: "column",
        width: "100%",
        color: COLORS.EmotionalBlack,
        alignItems: "center",
    }),
    loginButton: style({
        backgroundColor: COLORS.BaseColor,
        color: COLORS.EmotionalWhite,
        textTransform: "none",
        $nest: {
            "&:hover": {
                backgroundColor: COLORS.DarkColor,
            },
        },
    }),
};

@inject("AuthStore")
@observer
export class LoginPage extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            name: "",
            password: "",
        };
    }

    public render() {
        if (this.props.AuthStore!.authStatus === AuthStatus.Authorized) {
            return <Redirect to="/"/>;
        }

        return (
            <div className={styles.root}>
                <form className={styles.loginCardWrapper}>
                    <Card className={styles.loginCard}>
                        <Typography variant="headline" component="h3">
                            parakeet ログイン
                        </Typography>
                        <CardContent className={styles.loginInputs}>
                            <TextField
                                label="アカウント名"
                                margin="normal"
                                fullWidth
                                value={this.state.name}
                                onChange={(event) => this.setState({
                                    name: event.target.value,
                                })}
                            />
                            <TextField
                                label="パスワード"
                                margin="normal"
                                type="password"
                                fullWidth
                                value={this.state.password}
                                onChange={(event) => this.setState({
                                    password: event.target.value,
                                })}
                            />
                        </CardContent>
                        <CardActions className={styles.loginActions}>
                            <div className={styles.loginButtons}>
                                <Button fullWidth variant="raised" classes={{root: styles.loginButton}} onClick={() => this.props.AuthStore!.login(this.state.name, this.state.password)} type={"submit"} onSubmit={() => false}>
                                    <Send/>
                                    <span style={{marginLeft: ".5rem"}}>ログイン</span>
                                </Button>
                            </div>
                        </CardActions>
                    </Card>
                </form>
            </div>
        );
    }
}