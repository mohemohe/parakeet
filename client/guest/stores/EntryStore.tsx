import {action, observable} from "mobx";
import StoreBase, {IModel, IPagitane, Mode, State} from "./StoreBase";

export interface IEntry extends IModel {
    title: string;
    tags: string[];
    body: string;
    author: string;
}

export class EntryStore extends StoreBase {
    @observable
    public entries: IEntry[];

    @observable
    public info: IPagitane;

    @observable
    public entry: IEntry;

    constructor(entries?: IEntry[], entry?: IEntry, paginate?: IPagitane) {
        super();

        this.entries = entries || [];
        this.entry = entry || {} as IEntry;
        this.info = paginate || {
            current: 1,
            perPage: 10,
            recordsOnPage: 10,
            totalPages: 1,
            totalRecords: 10,
        };
    }

    @action
    public async getEntries(page?: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries?page=${page || this.info.current}`;
            const response = await fetch(url, {
                method: "GET",
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
}