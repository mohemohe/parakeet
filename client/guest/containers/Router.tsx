import { createBrowserHistory, createMemoryHistory } from "history";
import { inject, observer } from "mobx-react";
import React from "react";
import { Route, Router as ReactRouter, Routes } from "react-router";
import { StaticRouter } from "react-router-dom";
import { style } from "typestyle";

import MobxReactRouter, { syncHistoryWithStore } from "@superwf/mobx-react-router";

import { COLORS, DARK_COLORS } from "../constants/Style";
import { SingleEntry } from "./common/SingleEntry";
import Toast from "./common/Toast";
import EntriesList from "./page/EntriesList";
import Index from "./page/Index";
import Notfound from "./page/NotFound";
import { Template } from "./Template";

import type { RouterStore } from "@superwf/mobx-react-router";

interface IProps {
  isSSR: boolean;
  title: string;
  pathname: string;
  RouterStore?: RouterStore;
}

interface IState {}

const styles = {
  root: style({
    background: COLORS.BackGround,
    display: "flex",
    flexDirection: "column" as "column",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    $nest: {
      ["@media (prefers-color-scheme: dark)"]: {
        background: DARK_COLORS.BackGround,
      },
    },
  }),
};

@inject("RouterStore")
@observer
export default class Router extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    const history = this.props.isSSR
      ? createMemoryHistory()
      : createBrowserHistory();
    this.history = syncHistoryWithStore(history, this.props.RouterStore!);
    this.history.replace(this.props.pathname);
    this.pathname = this.props.pathname;
    this.history.subscribe((location, action) => {
      if (location.pathname != this.pathname) {
        this.pathname = location.pathname;
        window.scrollTo(0, 0);
      }
    });
  }

  private history: MobxReactRouter.SynchronizedHistory;
  private pathname: string;

  public render() {
    const s = (
      <Routes>
        <Route exact={true} path="/" component={Index} />
        <Route path="/entries/:id" component={EntriesList} />
        <Route path="/entry/:id" component={SingleEntry} />
        <Route component={Notfound} />
      </Routes>
    );

    return (
      <ReactRouter history={this.history}>
        <div id={"parakeet"} className={styles.root}>
          <Template title={this.props.title} showSearch={!this.props.isSSR}>
            {this.props.isSSR ? (
              <StaticRouter
                location={this.props.RouterStore!.location}
                context={this.context || {}}
              >
                {s}
              </StaticRouter>
            ) : (
              s
            )}
          </Template>
          <Toast />
        </div>
      </ReactRouter>
    );
  }
}
