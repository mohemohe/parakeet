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
    public accessToken: string;

    @observable
    public refreshToken: string;

    @observable
    public userInfo: any;

    constructor() {
        super();

        this.userInfo = {} as any;
        this.accessToken = localStorage.accessToken || "";
        this.refreshToken = localStorage.refreshToken || "";
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

            const result = await response.json();
            if (result.statusCode === 200) {
                this.accessToken = localStorage.accessToken = result.tokens.accessToken;
                this.refreshToken = localStorage.refreshToken = result.tokens.refreshToken;
            } else {
                throw new Error();
            }

            await this.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.authStatus = AuthStatus.Unauthorized;
        this.accessToken = "";
        this.refreshToken = "";
        this.userInfo = {} as any;
    }

    @action
    public async checkAuth() {
        if (!this.accessToken || !this.refreshToken) {
            this.logout();
            return;
        }
        const response = await fetch(this.apiBasePath + "v1/me", {
            headers: this.generateFetchHeader(),
        });
        if (!response.ok) {
            this.logout();
            return;
        }

        const result = await response.json();
        if (result.statusCode !== 200) {
            this.logout();
        }

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