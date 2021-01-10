import {action, computed, observable} from "mobx";
import StoreBase, {IModel, Mode, State} from "./StoreBase";

export interface IFileInfo extends IModel {
    name: string;
    path: string;
    size: number;
    type: FileType;
}

export enum FileType {
    NONE = 0,
    DIRECTORY = 1,
    FILE = 2,
}

export enum Command {
    NONE,
    COPY,
    MOVE,
    DELETE,
}

export interface ISource extends Partial<IFileInfo> {
    command: Command,
}

export class DriveStore extends StoreBase {
    @observable
    public currentDir: string;

    @observable
    public info: IFileInfo[];

    @observable
    public editName: string;

    @observable
    public selectedIndex: number;

    @observable
    public hoveredIndex: number;

    @observable
    public source: ISource;

    @observable
    public showEditNameDialog: boolean;

    @observable
    public showMkDirDialog: boolean;

    @observable
    public showDeleteConfirmDialog: boolean;

    @observable
    public showPropertyDialog: boolean;

    constructor() {
        super();

        this.currentDir = "";
        this.editName = "";
        this.info = [];
        this.source = {
            command: Command.NONE,
        };
        this.selectedIndex = -1;
        this.hoveredIndex = -1;
        this.showEditNameDialog = false;
        this.showMkDirDialog = false;
        this.showDeleteConfirmDialog = false;
        this.showPropertyDialog = false;
    }

    @action
    public async getFile(path: string) {
        this.setMode(Mode.GET);
        this.setState(State.RUNNING);

        if (path.startsWith("/")) {
            this.currentDir = path.substring(1);
        } else {
            this.currentDir = path;
        }

        try {
            const url = `${this.apiBasePath}v1/drive/${path}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.generateFetchHeader(),
            });

            if (response.status !== 200) {
                throw new Error();
            }
            this.info = await response.json();

            this.setState(State.DONE);
        } catch (e) {
            this.tryShowToast("ドライブの取得に失敗しました");
            console.error(e);
            this.setState(State.ERROR);
        }
    }

    @action
    public async mkDir() {
        try {
            this.setMode(Mode.GET);
            this.setState(State.RUNNING);

            const path = `${this.currentDir}${this.editName}`;

            const url = this.apiBasePath + `v1/drive/${path}/`;
            const response = await fetch(url, {
                headers: this.generateFetchHeader(),
                method: "POST",
            });

            if (response.ok) {
                this.resetSource();
                this.showMkDirDialog = false;
                this.setState(State.DONE);
                this.getFile(this.currentDir);
            } else {
                throw new Error();
            }
        } catch (e) {
            this.setState(State.ERROR);
            console.error(e);
            this.tryShowToast("ファイル操作に失敗しました");
        }
    }

    @action
    public async upload(files: FileList) {
        try {
            this.setMode(Mode.GET);
            this.setState(State.RUNNING);

            for (let i = 0; i < files.length; i++) {
                const path = `${this.currentDir}${files[i].name}`;

                const url = this.apiBasePath + `v1/drive/${path}`;
                const response = await fetch(url, {
                    headers: this.generateFetchHeader(),
                    method: "POST",
                    body: files[i],
                });

                if (!response.ok) {
                    throw new Error();
                }
                this.getFile(this.currentDir);
            }

            this.setState(State.DONE);
        } catch (e) {
            this.setState(State.ERROR);
            console.error(e);
            this.tryShowToast("ファイル操作に失敗しました");
        }
    }

    @action
    public async rename() {
        try {
            this.setMode(Mode.GET);
            this.setState(State.RUNNING);

            const url = this.apiBasePath + `v1/drive/${this.currentDir}${this.editName}`;
            const response = await fetch(url, {
                headers: this.generateFetchHeader(),
                method: "PUT",
                body: JSON.stringify({
                    operation: "move",
                    src: this.source.path,
                })
            });

            if (response.ok) {
                this.getFile(this.currentDir);
                this.showEditNameDialog = false;
                this.resetSource();
                this.setState(State.DONE);
            } else {
                throw new Error();
            }
        } catch (e) {
            this.setState(State.ERROR);
            console.error(e);
            this.tryShowToast("ファイル操作に失敗しました");
        }
    }

    @action
    public async paste() {
        try {
            this.setMode(Mode.GET);
            this.setState(State.RUNNING);

            const url = this.apiBasePath + `v1/drive/${this.currentDir}${this.source.name}`;
            const response = await fetch(url, {
                headers: this.generateFetchHeader(),
                method: "PUT",
                body: JSON.stringify({
                    operation: this.source.command === Command.MOVE ? "move" : "copy",
                    src: this.source.path,
                })
            });

            if (response.ok) {
                this.getFile(this.currentDir);
                if (this.source.command === Command.MOVE) {
                    this.resetSource();
                }
                this.setState(State.DONE);
            } else {
                throw new Error();
            }
        } catch (e) {
            this.setState(State.ERROR);
            console.error(e);
            this.tryShowToast("ファイル操作に失敗しました");
        }
    }

    @action
    public async delete() {
        try {
            this.setMode(Mode.GET);
            this.setState(State.RUNNING);

            const path = this.selectedInfo.path;

            const url = this.apiBasePath + `v1/drive${path}`;
            const response = await fetch(url, {
                headers: this.generateFetchHeader(),
                method: "DELETE",
            });

            if (response.ok) {
                this.resetSource();
                this.showDeleteConfirmDialog = false;
                this.setState(State.DONE);
                this.getFile(this.currentDir);
            } else {
                throw new Error();
            }
        } catch (e) {
            this.setState(State.ERROR);
            console.error(e);
            this.tryShowToast("ファイル操作に失敗しました");
        }
    }

    @action
    public setSelectedIndex(index: number) {
        this.selectedIndex = index;
    }

    @action
    public setHoveredIndex(index: number) {
        this.hoveredIndex = index;
    }

    @action
    public setSource(command: Command) {
        this.source = {
            command,
            ...this.selectedInfo,
        };
    }

    @action
    public resetSource() {
        this.source = {
            command: Command.NONE,
        };
    }

    @computed
    public get selectedInfo() {
        if (this.selectedIndex === -1) {
            return {
                type: FileType.NONE,
            } as IFileInfo;
        }
        return this.info[this.selectedIndex];
    }

    public open(download?: boolean) {
        if (!this.selectedInfo) {
            return;
        }
        let url = this.apiBasePath + `v1/drive${this.selectedInfo.path}`;
        const a = document.createElement("a") as HTMLAnchorElement;
        a.href = url;
        a.target = "_blank";
        if (download === true) {
            a.download = this.selectedInfo.name;
        }
        a.click();
    }

    @action
    public setEditName(name: string) {
        this.editName = name;
    }

    @action
    public setShowEditNameDialog(show: boolean) {
        this.showEditNameDialog = show;
    }

    @action
    public setShowMkDirDialog(show: boolean) {
        this.showMkDirDialog = show;
    }

    @action
    public setShowDeleteConfirmDialog(show: boolean) {
        this.showDeleteConfirmDialog = show;
    }

    @action
    public setShowPropertyDialog(show: boolean) {
        this.showPropertyDialog = show;
    }
}
