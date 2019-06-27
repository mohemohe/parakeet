import {action, observable} from "mobx";
import StoreBase, {Mode, State} from "./StoreBase";

export interface IUserInfo {
    name: string;
    role: number;
}

export class UserStore extends StoreBase {
    @observable
    public users: IUserInfo[];

    constructor() {
        super();

        this.users = [];
    }

    @action
    public async getUsers(page: number) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        try {
            const url = `${this.apiBasePath}v1/users?page=${page}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            const result = await response.json();
            this.users = result.users;

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ユーザーの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }
}