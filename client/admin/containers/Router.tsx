import * as React from "react";
import {style} from "typestyle";
import {inject, observer} from "mobx-react";
import {Route, Router as ReactRouter, StaticRouter, Switch} from "react-router";
import {createHashHistory} from "history";
import MobxReactRouter, {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import {SIZES} from "../constants/Style";
import Toast from "./common/Toast";
import Notfound from "./page/NotFound";
import Index from "./page";
import {AuthStatus, AuthStore} from "../stores/AuthStore";
import {LoginPage} from "./page/auth/Login";

interface IProps {
    RouterStore?: RouterStore;
    AuthStore?: AuthStore;
}

interface IState {
}

const styles = {
    root: style({
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",

    }),
    contents: style({
        display: "flex",
        flex: 1,
        flexDirection: "column" as "column",
        minHeight: "100%",
        width: "100%",
        maxWidth: "100%",
    }),
};

@inject("RouterStore", "AuthStore")
@observer
export default class Router extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        const history = createHashHistory();
        this.history = syncHistoryWithStore(history, this.props.RouterStore!);
        this.history.replace(window.location.hash.substring(1));
    }

    private history: MobxReactRouter.SynchronizedHistory;

    public componentDidMount() {
        this.props.AuthStore!.checkAuth();
    }

    public render() {
        return (
            <ReactRouter history={this.history}>
                <div className={styles.root}>
                    <div className={styles.contents}>
                        <StaticRouter location={this.props.RouterStore!.location} context={this.context || {}}>
                            <Switch>
                                {this.props.AuthStore!.authStatus === AuthStatus.Unauthorized ?
                                    <>
                                        <Route component={LoginPage} />
                                    </> :
                                    <>
                                        <Route exact={true} path="/" component={Index} />
                                        <Route exact={true} path="/auth/login" component={Index} />
                                        <Route component={Notfound} />
                                    </>
                                }
                            </Switch>
                        </StaticRouter>
                    </div>
                    <Toast/>
                </div>
            </ReactRouter>
        );
    }
}