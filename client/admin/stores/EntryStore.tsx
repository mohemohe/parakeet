import {action, computed, observable} from "mobx";
import StoreBase, {IModel, IPagitane, Mode, State} from "./StoreBase";
import React from "react";
import Edit from "@material-ui/icons/Edit";
import stores from "../../admin/stores";
import {LinkButton} from "../../common/components/LinkButton";

export interface IEntry extends IModel {
    title: string;
    tags: string[];
    body: string;
    draft: boolean;
    find_count?: number;
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
        this.entry = {
            draft: false,
        } as IEntry;
        this.info = {} as IPagitane;
    }

    @action
    public async getEntries(page: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries?draft=1&limit=10&page=${page}`;
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
            if (entry._created === entry._modified) {
                entry._modified = "";
            } else {
                if (entry._modified) {
                    entry._modified = new Date(entry._modified).toLocaleString();
                }
            }
            if (entry._created) {
                entry._created = new Date(entry._created).toLocaleString();
            }
            (entry as any)._draft = entry.draft ? <Edit/> : undefined;
            (entry as any)._find_count = entry.find_count || 0;
            return {
                ...entry,
                path: <LinkButton to={`/entries/${entry._id}`} buttonProps={{variant: "contained", color: "primary"}}>編集</LinkButton>,
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

    @action
    public async resetEntry() {
        this.entry = {
            draft: false,
        } as IEntry;
    }
}