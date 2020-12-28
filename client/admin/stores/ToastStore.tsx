import {action, observable, toJS} from "mobx";
import StoreBase from "./StoreBase";

export interface Toast {
    uid: string;
    message?: string;
    open: boolean;
}

export default class ToastStore extends StoreBase {
    @observable
    public toasts: Toast[];

    constructor() {
        super();

        this.toasts = [];
    }

    @action.bound
    public showToast(message?: string) {
        const uid = `${new Date().getTime() + Math.random()}`;
        const nextToasts = this.toasts.slice(-9);
        nextToasts.push({ message, open: true, uid });
        console.log(toJS(nextToasts))
        this.toasts = [ ...nextToasts ];

        setTimeout(() => this.closeToast(uid), 5000);
    }

    @action.bound
    public setToast(toasts: Toast[]) {
        this.toasts = [ ...toasts ];
    }

    @action.bound
    public closeToast(uid: string) {
        const targetIndex = this.toasts.findIndex(value => value.uid === uid);
        if (targetIndex !== -1) {
            this.toasts[targetIndex].open = false;
        }
        this.setToast(this.toasts);
    }
}