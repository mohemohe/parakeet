import * as React from "react";
import {style} from "typestyle";
import {inject, observer} from "mobx-react";
import {Route, Router as ReactRouter, Switch} from "react-router";
import {createHashHistory} from "history";
import MobxReactRouter, {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import Toast from "./common/Toast";
import Notfound from "./page/NotFound";
import {AuthStatus, AuthStore} from "../stores/AuthStore";
import {LoginPage} from "./page/auth/Login";
import {RouteHelper} from "../helpers/RouteHelper";
import {IRouteInfo, ROUTES} from "../constants/Route";
import {LeftNav} from "./common/LeftNav";
import {SyncedRouter} from "../../common/components/SyncedRouter";

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
        display: "flex",
    }),
    contents: style({
        display: "flex",
        flex: 1,
        flexDirection: "column" as "column",
        minHeight: "100%",
        width: "100%",
        maxWidth: "100%",
        padding: "1rem",
        overflow: "auto",
    }),
};

@inject("RouterStore", "AuthStore")
@observer
export default class Router extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        const history = createHashHistory();
        this.history = syncHistoryWithStore(history, this.props.RouterStore!);
        this.routeArray = [];
    }

    private history: MobxReactRouter.SynchronizedHistory;
    private routeArray: any[];

    public componentDidMount() {
        this.props.AuthStore!.checkAuth();
    }

    public handleDrawerToggle() {
        this.setState({});
    };

    private generateRoute() {
        this.routeArray = [];

        const routes: IRouteInfo[] = Object.assign([], ROUTES);
        const enableRoutes = RouteHelper.getRoute(routes, this.props.AuthStore!, false);
        this.routeParser(enableRoutes);
        this.routeArray.push(<Route component={Notfound} key={this.routeArray.length}/>);

        return this.routeArray;
    }

    private routeParser(routes: IRouteInfo[]) {
        routes.forEach((route) => {
            if (route.path) {
                this.routeArray.push(<Route exact path={route.path} component={route.component ? route.component : Notfound} key={this.routeArray.length}/>);
            }
            if (route.children) {
                this.routeParser(route.children);
            }
        });
    }

    public render() {
        return (
            <ReactRouter history={this.history}>
                <div className={styles.root}>
                    <LeftNav/>
                    <div className={styles.contents}>
                        <SyncedRouter history={this.props.RouterStore!.history}>
                            {this.props.AuthStore!.token == "" && this.props.AuthStore!.authStatus === AuthStatus.Unauthorized ?
                                <Switch>
                                    <Route component={LoginPage} />
                                </Switch> :
                                <Switch>
                                    {this.generateRoute()}
                                </Switch>
                            }
                        </SyncedRouter>
                    </div>
                    <Toast/>
                </div>
            </ReactRouter>
        );
    }
}