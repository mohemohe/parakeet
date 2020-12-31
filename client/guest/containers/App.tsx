import React from "react";
import { Provider } from "mobx-react";
import createStore, {ISSRState} from "../stores";
import Router from "./Router";

interface IProps {
    isSSR: boolean;
    title: string;
    ssrState: ISSRState;
    pathname: string;
}

interface IState {
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
        this.store = createStore(props.isSSR, props.ssrState);
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