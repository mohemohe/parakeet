import * as React from "react";
import { style } from "typestyle";
import { inject, observer } from "mobx-react";
import {Route, Router as ReactRouter, StaticRouter, Switch} from "react-router";
import {createMemoryHistory, createBrowserHistory} from "history";
import MobxReactRouter, {syncHistoryWithStore, RouterStore} from "mobx-react-router";
import Toast from "./common/Toast";
import Notfound from "./page/NotFound";
import Index from "./page/Index";
import {COLORS} from "../constants/Style";
import {SingleEntry} from "./common/SingleEntry";
import {Template} from "./Template";
import EntriesList from "./page/EntriesList";

interface IProps {
    isSSR: boolean;
    pathname: string;
    RouterStore?: RouterStore;
}

interface IState {
}

const styles = {
    root: style({
        background: COLORS.BackGround,
        display: "flex",
        flexDirection: "column" as "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
    }),
};

@inject("RouterStore")
@observer
export default class Router extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        const history = this.props.isSSR ? createMemoryHistory() : createBrowserHistory();
        this.history = syncHistoryWithStore(history, this.props.RouterStore!);
        this.history.replace(this.props.pathname);
    }

    private history: MobxReactRouter.SynchronizedHistory;

    public render() {
        const s = (
            <Switch>
                <Route exact={true} path="/" component={Index} />
                <Route path="/entries/:id" component={EntriesList} />
                <Route path="/entry/:id" component={SingleEntry} />
                <Route component={Notfound} />
            </Switch>
        );

        return (
            <ReactRouter history={this.history}>
                <div className={styles.root}>
                    <Template>
                        {this.props.isSSR ?
                            <StaticRouter location={this.props.RouterStore!.location} context={this.context || {}}>
                                {s}
                            </StaticRouter> :
                            s
                        }
                    </Template>
                    <Toast/>
                </div>
            </ReactRouter>
        );
    }
}