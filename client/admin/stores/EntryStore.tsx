import {action, computed, observable} from "mobx";
import StoreBase, {IModel, IPagitane, Mode, State} from "./StoreBase";
import {Link} from "react-router-dom";
import React from "react";
import stores from "./index";

export interface IEntry extends IModel {
    title: string;
    tags: string[];
    body: string;
}

export class EntryStore extends StoreBase {
    @observable
    public entries: IEntry[];

    @observable
    public info: IPagitane;

    @observable
    public entry: IEntry;

    constructor() {
        super();

        this.entries = [];
        this.entry = {} as IEntry;
        this.info = {} as IPagitane;
    }

    @action
    public async getEntries(page: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries?page=${page}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.entries = result.entries;
            this.info = result.info;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("エントリーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @computed
    public get editableEntries() {
        return this.entries.map((entry) => {
            return {
                ...entry,
                path: <Link to={`/entries/${entry._id}`}>編集</Link>,
            }
        })
    }

    @action
    public async getEntry(id: string) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries/${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.entry = result.entry;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("エントリーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async putEntry() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries/${this.entry._id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.entry),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.entry = result.entry;

            this.tryShowToast("エントリーを編集しました");
            this.setState(State.DONE);

            stores.RouterStore.history.push(`/entries/${this.entry._id}`);
        } catch (e) {
            this.tryShowToast("エントリーの保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async setEntry(entry: IEntry) {
        this.entry = entry;
    }
}