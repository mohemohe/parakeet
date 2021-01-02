import {action, observable} from "mobx";
import StoreBase, {IModel, Mode, State} from "./StoreBase";
import stores from "../../admin/stores";

export interface INotifyModel extends IModel {
    baseurl: string;
    token: string;
    template: string;
}

export interface IRender extends IModel {
    entries: boolean;
    entry: boolean;
    timeout: number;
}

export interface ICloudflare extends IModel {
    enable: boolean;
    zone_id: string;
    api_token: string;
}

export interface IS3 extends IModel {
    region: string;
    bucket: string;
    access_key_id: string;
    access_secret_key: string;
    endpoint: string;
}

export class SettingsStore extends StoreBase {
    @observable
    public siteTitle: string;

    @observable
    public sideNavContents: string[];

    @observable
    public notifyMastodon: INotifyModel;

    @observable
    public notifyMisskey: INotifyModel;

    @observable.shallow
    public render: IRender;

    @observable
    public mongoDbQueryCache: boolean;

    @observable
    public ssrPageCache: boolean;

    @observable.shallow
    public cloudflare: ICloudflare;

    @observable
    public customCss: string;

    @observable
    public mongoDbSearch: string;

    @observable
    public s3: IS3;

    constructor() {
        super();

        this.siteTitle = "";
        this.sideNavContents = [];
        this.notifyMastodon = {} as INotifyModel;
        this.notifyMisskey = {} as INotifyModel;
        this.render = {
            entries: false,
            entry: false,
            timeout: 3000,
        } as IRender;
        this.mongoDbQueryCache = false;
        this.ssrPageCache = false;
        this.cloudflare = {
            enable: false,
            zone_id: "",
            api_token: "",
        } as ICloudflare;
        this.customCss = "";
        this.mongoDbSearch = "";
        this.s3 = {
            region: "",
            bucket: "",
            access_key_id: "",
            access_secret_key: "",
            endpoint: "",
        } as IS3;
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
    public async getSideNavContents() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/site/sidenav`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(false),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            if (result.value.length == 0) {
                this.sideNavContents = [""];
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
    public setSideNavContents(sideNavContents: string[]) {
        this.sideNavContents = sideNavContents
    }

    @action
    public async putSideNavContents() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/site/sidenav`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    key: "",
                    value: this.sideNavContents,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.sideNavContents = result.value;

            this.tryShowToast("サイドバーコンテンツを編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("サイドバーコンテンツの保存に失敗しました");
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
    public setNotifyMastodon(notifyMastodon: INotifyModel) {
        this.notifyMastodon = notifyMastodon;
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
    public async getNotifyMisskey() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/notify/misskey`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.notifyMisskey = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("Misskey通知の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setNotifyMisskey(notifyMisskey: INotifyModel) {
        this.notifyMisskey = notifyMisskey;
    }

    @action
    public async putNotifyMisskey() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/notify/misskey`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.notifyMisskey),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.notifyMisskey = result.value;

            this.tryShowToast("Misskey通知を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("Misskey通知の保存に失敗しました");
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
            if (!result.value.timeout || result.value.timeout === 0) {
                result.value.timeout = 3000;
            }
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

    @action
    public async getCloudflare() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/cloudflare`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.cloudflare = result.value;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("キャッシュ設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setCloudflare(cloudflare: ICloudflare) {
        this.cloudflare = cloudflare;
    }

    @action
    public async putCloudflare() {
        this.setMode(Mode.UPDATE);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/cache/cloudflare`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.cloudflare),
            });

            if (response.status !== 200) {
                throw new Error();
            }

            const result = await response.json();
            this.cloudflare = result.value;

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
    public async getCustomCss() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/style/custom`;
            const response = await fetch(url, {
                method: "GET",
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.customCss = await response.text();

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("カスタムCSSの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setCustomCss(css: string) {
        this.customCss = css;
    }

    @action
    public async putCustomCss() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/style/custom`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    key: "",
                    value: this.customCss,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.customCss = result.value;

            this.tryShowToast("カスタムCSSを編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("カスタムCSSの保存に失敗しました");
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

    @action
    public setMongoDbSearch(type: string) {
        this.mongoDbSearch = type;
    }

    @action
    public async putMongoDbSearch() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/search/mongodb`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify({
                    key: "",
                    value: this.mongoDbSearch,
                }),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.mongoDbSearch = result.value;

            this.tryShowToast("MongoDB検索設定を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("MongoDB検索設定の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async getS3() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/aws/s3`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.s3 = await response.json();

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("S3接続設定の取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public setS3(s3: Partial<IS3>) {
        this.s3 = { ...this.s3, ...s3 };
    }

    @action
    public async putS3() {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/settings/aws/s3`;
            const response = await fetch(url, {
                method: "PUT",
                headers: this.generateFetchHeader(),
                body: JSON.stringify(this.s3),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.s3 = await response.json();

            this.tryShowToast("S3接続設定を編集しました");
            stores.AuthStore.checkAuth();
            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("S3接続設定の保存に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }
}
