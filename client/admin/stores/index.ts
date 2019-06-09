import {RouterStore} from "mobx-react-router";
import ToastStore from "../../common/stores/ToastStore";
import {AuthStore} from "./AuthStore";

const stores = {
    AuthStore: new AuthStore(),
    ToastStore: new ToastStore(),
    RouterStore: new RouterStore(),
};

export default stores;