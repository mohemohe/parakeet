import {action, observable} from "mobx";
import StoreBase from "./StoreBase";

export default class ToastStore extends StoreBase {
    @observable
    public message?: string;

    @observable
    public open: boolean;

    constructor() {
        super();

        this.message = undefined;
        this.open = false;
    }

    @action.bound
    public showToast(message?: string) {
        this.message = message;
        this.open = true;
    }
}