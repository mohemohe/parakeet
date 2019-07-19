import ToastStore from "./ToastStore";
import {RouterStore} from "mobx-react-router";
import {EntryStore} from "./EntryStore";

let cached: {
    ToastStore: ToastStore;
    RouterStore: RouterStore;
    EntryStore: EntryStore;
};

export default function createStore(isSSR: boolean) {
    let initialState = {};
    if (!isSSR) {
        initialState = (window as any).__INITIAL_STATE__ || {};
        console.log("initial state:", initialState);
    }

    cached = {
        ToastStore: new ToastStore(),
        RouterStore: new RouterStore(),
        EntryStore: new EntryStore(),
    };

    return cached;
};

export class Stores {
    static get cached() {
        return cached;
    }
}