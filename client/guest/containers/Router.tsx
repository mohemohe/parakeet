import * as React from "react";
import { style } from "typestyle";
import { inject, observer } from "mobx-react";
import {Route, Router as ReactRouter, StaticRouter, Switch} from "react-router";
import {createMemoryHistory} from "history";
import MobxReactRouter, {syncHistoryWithStore, RouterStore} from "mobx-react-router";
import { SIZES } from "../constants/Style";
import Toast from "./common/Toast";
import Notfound from "./page/NotFound";
import Index from "./page/Index";

interface IProps {
    isSSR: boolean;
    pathname: string;
    RouterStore?: RouterStore;
}

interface IState {
}

const styles = {
    root: style({
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
    }),
    bottom: style({
        display: "flex",
        height: `calc(100vh - ${SIZES.Header.height}px)`,
        overflow: "hidden" as "hidden",
    }),
    contentWrapper: style({
        flex: 1,
        overflow: "auto" as "auto",
    }),
    contentInner: style({
        display: "flex",
        minWidth: "100%",
        minHeight: "100%",
        padding: "1rem",
        boxSizing: "border-box",
        overflow: "hidden" as "hidden",
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

@inject("RouterStore")
@observer
export default class Router extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        const memoryHistory = createMemoryHistory();
        this.history = syncHistoryWithStore(memoryHistory, this.props.RouterStore!);
        this.history.replace(this.props.pathname);
    }

    private history: MobxReactRouter.SynchronizedHistory;

    public render() {
        return (
            <ReactRouter history={this.history}>
                <div className={styles.root}>
                    <div className={styles.bottom}>
                        <div className={styles.contentWrapper}>
                            <div className={styles.contentInner}>
                                <div className={styles.contents}>
                                    <StaticRouter location={this.props.RouterStore!.location} context={this.context || {}}>
                                        <Switch>
                                            <Route exact={true} path="/" component={Index} />
                                            <Route component={Notfound} />
                                        </Switch>
                                    </StaticRouter>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toast/>
                </div>
            </ReactRouter>
        );
    }
}