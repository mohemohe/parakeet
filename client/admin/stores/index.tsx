import {RouterStore} from "mobx-react-router";
import ToastStore from "../../common/stores/ToastStore";
import {AuthStore} from "../../common/stores/AuthStore";
import {UserStore} from "../../common/stores/UserStore";
import {EntryStore} from "../../common/stores/EntryStore";

const stores = {
    AuthStore: new AuthStore(),
    ToastStore: new ToastStore(),
    RouterStore: new RouterStore(),
    UserStore: new UserStore(),
    EntryStore: new EntryStore(),
};

export default stores;