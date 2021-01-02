import React from "react";
import {action, computed, observable} from "mobx";
import StoreBase, {IModel, IPagitane, Mode, State} from "./StoreBase";
import stores from "../../admin/stores";
import {LinkButton} from "../../common/components/LinkButton";

export interface IFileInfo extends IModel {
    name: string;
    email: string;
    role: number;
}

export class DriveStore extends StoreBase {
    @observable
    public path: string;

    @observable
    public info: IFileInfo[];

    constructor() {
        super();

        this.path = "";
        this.info = [];
    }

    @action
    public async getFile(path: string) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        this.path = path;

        try {
            const url = `${this.apiBasePath}v1/drive/${this.path}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.info = await response.json();

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ドライブの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }
    //
    // @computed
    // public get editableUsers() {
    //     return this.users.map((user) => {
    //         return {
    //             ...user,
    //             path: <LinkButton to={`/users/${user._id}/edit`} buttonProps={{variant: "contained", color: "primary"}}>編集</LinkButton>,
    //         }
    //     })
    // }
    //
    // @action
    // public async getUser(id: string) {
    //     this.setMode(Mode.GET);
    //     this.setState(State.RUNNING);
    //
    //     try {
    //         const url = `${this.apiBasePath}v1/users/${id}`;
    //         const response = await fetch(url, {
    //             method: "GET",
    //             headers: this.generateFetchHeader(),
    //         });
    //
    //         if (response.status !== 200) {
    //             throw new Error();
    //         }
    //         const result = await response.json();
    //         this.user = result.user;
    //
    //         this.setState(State.DONE);
    //     } catch (e) {
    //         this.tryShowToast("ユーザーの取得に失敗しました");
    //         console.error(e);
    //         this.setState(State.ERROR);
    //     }
    // }
    //
    // @action
    // public async putUser() {
    //     this.setMode(Mode.GET);
    //     this.setState(State.RUNNING);
    //
    //     try {
    //         const url = `${this.apiBasePath}v1/users/${this.user._id}`;
    //         const response = await fetch(url, {
    //             method: "PUT",
    //             headers: this.generateFetchHeader(),
    //             body: JSON.stringify(this.user),
    //         });
    //
    //         if (response.status !== 200) {
    //             throw new Error();
    //         }
    //         const result = await response.json();
    //         this.user = result.user;
    //
    //         this.tryShowToast("ユーザーを編集しました");
    //         stores.AuthStore.checkAuth();
    //         this.setState(State.DONE);
    //     } catch (e) {
    //         this.tryShowToast("ユーザーの保存に失敗しました");
    //         console.error(e);
    //         this.setState(State.ERROR);
    //     }
    // }
    //
    // @action
    // public async setUser(info: IUser) {
    //     this.user = info;
    // }
}