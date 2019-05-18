import { action, observable } from "mobx";
import stores from ".";

export enum State {
    IDLE,
    RUNNING,
    DONE,
    ERROR,
}

export enum Mode {
    NONE,
    GET,
    SEARCH,
    CREATE,
    UPDATE,
    DELETE,
    ACTIVATE,
    LOGIN,
    LOGOUT,
    IMPORT,
}

export default class StoreBase {
    constructor() {
        this.state = State.IDLE;
        this.mode = Mode.NONE;
    }

    @observable
    public state: State;

    @observable
    public mode: Mode;

    @action.bound
    public setState(state: State) {
        this.state = state;
    }

    @action.bound
    public resetState() {
        this.state = State.IDLE;
    }

    @action.bound
    public setMode(mode: Mode) {
        this.mode = mode;
    }

    @action.bound
    public resetMode() {
        this.mode = Mode.NONE;
    }

    protected tryShowToast(message?: string) {
        try {
            stores.ToastStore.showToast(message);
        } catch (e) {}
    }

    protected get apiBasePath() {
        return location.pathname + "api/";
    }
}