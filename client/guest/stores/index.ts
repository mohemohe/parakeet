import ToastStore from "./ToastStore";
import {RouterStore} from "mobx-react-router";
import {EntryStore} from "./EntryStore";
import {SettingsStore} from "./SettingsStore";
import {SearchStore} from "./SearchStore";

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
    SettingsStore: SettingsStore;
    SearchStore: SearchStore;
};

export default function createStore(isSSR: boolean, ssrState: ISSRState) {
    cached = {
        ToastStore: new ToastStore(),
        RouterStore: new RouterStore(),
        EntryStore: new EntryStore(JSON.parse(ssrState.entryStore.entries), JSON.parse(ssrState.entryStore.entry), JSON.parse(ssrState.entryStore.paginate), isSSR),
        SettingsStore: new SettingsStore(isSSR),
        SearchStore: new SearchStore(isSSR),
    };
    return cached;
};

export class Stores {
    static get cached() {
        return cached;
    }
}