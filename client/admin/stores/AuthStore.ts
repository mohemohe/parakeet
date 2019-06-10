import {action, computed, observable} from "mobx";
import StoreBase, {Mode, State} from "./StoreBase";

export enum AuthStatus {
    Unauthorized = 0,
    Authorized = 1,
}

export class AuthStore extends StoreBase {
    @observable
    public authStatus: AuthStatus;

    @observable
    public token: string;

    @observable
    public userInfo: any;

    constructor() {
        super();

        this.userInfo = {} as any;
        this.token = localStorage.token || "";
        this.authStatus = AuthStatus.Unauthorized;
    }

    @action
    public async login(name: string, password: string) {
        this.setMode(Mode.LOGIN);
        this.setState(State.RUNNING);

        try {
            const response = await fetch(this.apiBasePath + "v1/auth", {
                method: "POST",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    name,
                    password,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.token = localStorage.token = result.token;
            this.userInfo = result.user;

            await this.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ログインに失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public logout() {
        localStorage.removeItem("token");
        this.authStatus = AuthStatus.Unauthorized;
        this.token = "";
        this.userInfo = {} as any;
    }

    @action
    public async checkAuth() {
        if (!this.token) {
            this.logout();
            return;
        }
        const response = await fetch(this.apiBasePath + "v1/auth", {
            headers: this.generateFetchHeader(),
        });
        if (response.status !== 200) {
            this.tryShowToast("ログインセッション エラー");
            this.logout();
            return;
        }

        const result = await response.json();
        this.userInfo = result.user;
        this.authStatus = AuthStatus.Authorized;
    }

    @computed
    public get role() {
        return this.isRoot ? "管理者" : "ユーザー";
    }

    @computed
    public get isRoot() {
        if (this.userInfo) {
            return this.userInfo.type === 1;
        } else {
            return false;
        }
    }
}