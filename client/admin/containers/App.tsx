import * as React from "react";
import { Provider } from "mobx-react";
import store from "../stores";
import Router from "./Router";
import {RouterStore} from "@superwf/mobx-react-router";
import {createHashHistory} from "history";

const history = createHashHistory();
store.RouterStore = new RouterStore(history);

interface IProps {
}

interface IState {
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
        this.store = store;
    }

    private store: any;

    public render() {
        return (
            <Provider {...this.store}>
                <Router {...this.props}/>
            </Provider>
        );
    }
}
