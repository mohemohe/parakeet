import {action, observable} from "mobx";
import StoreBase, {IModel, Mode, State} from "./StoreBase";
import stores from "../../admin/stores";

export interface INotifyMastodon extends IModel {
    baseurl: string;
    token: string;
    template: string;
}

export interface IRender extends IModel {
    entries: boolean;
    entry: boolean;
}

export class SettingsStore extends StoreBase {
    @observable
    public siteTitle: string;

    @observable
    public notifyMastodon: INotifyMastodon;

    @observable.shallow
    public render: IRender;

    @observable
    public mongoDbQueryCache: boolean;

    @observable
    public ssrPageCache: boolean;

    constructor() {
        super();

        this.siteTitle = "";
        this.notifyMastodon = {} as INotifyMastodon;
        this.render = {} as IRender;
        this.mongoDbQueryCache = false;
        this.ssrPageCache = false;
    }

    @action
    public async getSiteTitle() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/site/title`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.siteTitle = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("サイト情報の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setSiteTitle(title: string) {
        this.siteTitle = title
    }

    @action
    public async putSiteTitle() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/site/title`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    key: "",
                    value: this.siteTitle,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.siteTitle = result.value;

            this.tryShowToast("サイト情報を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("サイト情報の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getNotifyMastodon() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/notify/mastodon`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.notifyMastodon = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("Mastodon通知の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setNotifyMastodon(notifyMastodon: INotifyMastodon) {
        this.notifyMastodon = notifyMastodon
    }

    @action
    public async putNotifyMastodon() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/notify/mastodon`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.notifyMastodon),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.notifyMastodon = result.value;

            this.tryShowToast("Mastodon通知を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("Mastodon通知の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getRender() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/render/server`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.render = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("レンダリング設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setRender(render: IRender) {
        this.render = render;
    }

    @action
    public async putRender() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/render/server`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.render),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.render = result.value;

            this.tryShowToast("レンダリング設定を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("レンダリング設定の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getMongoDbQueryCache() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/mongodb`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.mongoDbQueryCache = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("キャッシュ設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setMongoDbQueryCache(enable: boolean) {
        this.mongoDbQueryCache = enable;
    }

    @action
    public async putMongoDbQueryCache() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/mongodb`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    value: this.mongoDbQueryCache,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.mongoDbQueryCache = result.value;

            this.tryShowToast("キャッシュ設定を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("キャッシュ設定の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getSsrPageCache() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/page`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.ssrPageCache = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("キャッシュ設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setSsrPageCache(enable: boolean) {
        this.ssrPageCache = enable;
    }

    @action
    public async putSsrPageCache() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/page`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    value: this.ssrPageCache,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.ssrPageCache = result.value;

            this.tryShowToast("キャッシュ設定を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("キャッシュ設定の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }
}
