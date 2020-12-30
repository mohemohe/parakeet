import {action, observable} from "mobx";
import StoreBase, {Mode, State} from "./StoreBase";

export class SettingsStore extends StoreBase {
    @observable
    public isSSR: boolean;

    @observable
    public sideNavContents: string[];

    @observable
    public mongoDbSearch: string;

    constructor(isSSR?: boolean) {
        super();

        this.isSSR = isSSR || false;
        this.sideNavContents = [];
        this.mongoDbSearch = "";
    }

    @action
    public async getSideNavContents(force: boolean = false) {
        if (this.isSSR) {
            return;
        }

        if (this.sideNavContents.length !== 0 && !force) {
            return;
        }

        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/site/sidenav`;
            const response = await fetch(url, {
                method: "GET",
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            if (!result.value || result.value.length == 0) {
                this.sideNavContents = [];
            } else {
                this.sideNavContents = result.value;
            }

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("サイドバーコンテンツの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getMongoDbSearch() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/search/mongodb`;
            const response = await fetch(url, {
                method: "GET",
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.mongoDbSearch = await response.text();

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("MongoDB検索設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }
}
