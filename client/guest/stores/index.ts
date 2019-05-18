import ToastStore from "./ToastStore";
import {RouterStore} from "mobx-react-router";

export default function createStore(isSSR: boolean) {
    let initialState = {};
    if (!isSSR) {
        initialState = (window as any).__INITIAL_STATE__ || {};
        console.log("initial state:", initialState);
    }

    return {
        ToastStore: new ToastStore(),
        RouterStore: new RouterStore(),
    }
};