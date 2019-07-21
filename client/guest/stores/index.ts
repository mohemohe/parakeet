import ToastStore from "./ToastStore";
import {RouterStore} from "mobx-react-router";
import {EntryStore} from "./EntryStore";

export interface ISSRState {
    entryStore: {
        entries: string;
        entry: string;
        paginate: string;
    }
}

let cached: {
    ToastStore: ToastStore;
    RouterStore: RouterStore;
    EntryStore: EntryStore;
};

export default function createStore(isSSR: boolean, ssrState: ISSRState) {
    if (!isSSR) {
        cached = {
            ToastStore: new ToastStore(),
            RouterStore: new RouterStore(),
            EntryStore: new EntryStore(JSON.parse(ssrState.entryStore.entries), JSON.parse(ssrState.entryStore.entry), JSON.parse(ssrState.entryStore.paginate)),
        };
    } else {
        cached = {
            ToastStore: new ToastStore(),
            RouterStore: new RouterStore(),
            EntryStore: new EntryStore(JSON.parse(ssrState.entryStore.entries), JSON.parse(ssrState.entryStore.entry), JSON.parse(ssrState.entryStore.paginate)),
        };
    }
    return cached;
};

export class Stores {
    static get cached() {
        return cached;
    }
}