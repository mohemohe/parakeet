import {action, observable} from "mobx";
import {Mode, State} from "./StoreBase";
import {EntryStore} from "./EntryStore";

export class SearchStore extends EntryStore {
    @observable
    public searchKeyword: string;

    @observable
    public showModal: boolean;

    constructor(isSSR?: boolean) {
        super(undefined, undefined, undefined, isSSR);

        this.searchKeyword = "";
        this.showModal = false;
    }

    @action
    public async getEntries(page?: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/entries?search=${this.searchKeyword.replace(/　/g, " ")}&page=${page || this.info.current}`;
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
    public setSearchKeyword(keyword: string) {
        this.searchKeyword = keyword;
    }

    @action
    public toggleShowModal(show?: boolean) {
        const nextShow = show || !this.showModal;
        this.showModal = nextShow;
        if (!nextShow) {
            this.entries = [];
            this.searchKeyword = "";
        }
    }
}