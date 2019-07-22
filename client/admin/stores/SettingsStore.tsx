import {action, observable} from "mobx";
import StoreBase, {IModel, Mode, State} from "./StoreBase";
import stores from "../../admin/stores";

export interface INotifyMastodon extends IModel {
    baseurl: string;
    token: string;
    template: string;
}

export class SettingsStore extends StoreBase {
    @observable
    public siteTitle: string;

    @observable
    public notifyMastodon: INotifyMastodon;

    constructor() {
        super();

        this.siteTitle = "";
        this.notifyMastodon = {} as INotifyMastodon;
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
}