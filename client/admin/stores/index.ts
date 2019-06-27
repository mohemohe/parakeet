import {RouterStore} from "mobx-react-router";
import ToastStore from "../../common/stores/ToastStore";
import {AuthStore} from "./AuthStore";
import {UserStore} from "./UserStore";

const stores = {
    AuthStore: new AuthStore(),
    ToastStore: new ToastStore(),
    RouterStore: new RouterStore(),
    UserStore: new UserStore(),
};

export default stores;