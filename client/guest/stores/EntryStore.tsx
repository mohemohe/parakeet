import {action, computed, observable} from "mobx";
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

    @observable
    public isHydrate: boolean;

    @observable
    public isSSR: boolean;

    constructor(entries?: IEntry[], entry?: IEntry, paginate?: IPagitane, isSSR?: boolean) {
        super();

        this.entries = entries || [];
        this.entry = entry || {} as IEntry;
        this.isHydrate = entry?._id != null;
        this.info = paginate || {
            current: 1,
            perPage: 5,
            recordsOnPage: 5,
            totalPages: 1,
            totalRecords: 5,
        };
        this.isSSR = isSSR || false;
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

            document.title = this.siteTitle;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("エントリーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @computed
    public get formattedEntries() {
        if (!this.entries || this.entries.length === 0) {
            return [];
        }
        return this.entries.map((entry) => {
            entry._created = new Date(entry._created).toLocaleString();
            entry._modified = new Date(entry._modified).toLocaleString();
            if (entry._created === entry._modified) {
                entry._modified = "";
            }
            return entry;
        });
    }

    @action
    public async getEntry(id: string) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries/${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(false, {
                    "X-Parakeet-Count": `${!this.isHydrate}`,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.entry = result.entry;

            document.title = `${this.entry.title} - ${this.siteTitle}`;

            this.setState(State.DONE);

            this.isHydrate = false;
        } catch (e) {
            this.tryShowToast("エントリーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @computed
    public get formattedEntry() {
        return {
            ...this.entry,
            _created: new Date(this.entry._created).toLocaleString(),
            _modified: this.entry._created !== this.entry._modified ? new Date(this.entry._modified).toLocaleString() : "",
        } as IEntry;
    }
}