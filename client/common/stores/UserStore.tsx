import React from "react";
import {action, computed, observable} from "mobx";
import StoreBase, {IModel, IPagitane, Mode, State} from "./StoreBase";
import stores from "../../admin/stores";
import {LinkButton} from "../components/LinkButton";

export interface IUser extends IModel {
    name: string;
    email: string;
    role: number;
}

export class UserStore extends StoreBase {
    @observable
    public users: IUser[];

    @observable
    public info: IPagitane;

    @observable
    public user: IUser;

    constructor() {
        super();

        this.users = [];
        this.user = {} as IUser;
        this.info = {} as IPagitane;
    }

    @action
    public async getUsers(page: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/users?page=${page}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.users = result.users;
            this.info = result.info;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ユーザーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @computed
    public get editableUsers() {
        return this.users.map((user) => {
            return {
                ...user,
                path: <LinkButton to={`/users/${user._id}/edit`} buttonProps={{variant: "raised", color: "primary"}}>編集</LinkButton>,
            }
        })
    }

    @action
    public async getUser(id: string) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/users/${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.user = result.user;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ユーザーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async putUser() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/users/${this.user._id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.user),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.user = result.user;

            this.tryShowToast("ユーザーを編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ユーザーの保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async setUser(info: IUser) {
        this.user = info;
    }
}