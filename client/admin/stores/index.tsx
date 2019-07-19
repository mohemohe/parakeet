import {RouterStore} from "mobx-react-router";
import ToastStore from "./ToastStore";
import {AuthStore} from "./AuthStore";
import {UserStore} from "./UserStore";
import {EntryStore} from "./EntryStore";

const stores = {
    AuthStore: new AuthStore(),
    ToastStore: new ToastStore(),
    RouterStore: new RouterStore(),
    UserStore: new UserStore(),
    EntryStore: new EntryStore(),
};

export default stores;