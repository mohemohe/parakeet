import * as React from "react";
import {inject, observer} from "mobx-react";
import {Command, DriveStore, FileType, IFileInfo} from "../../stores/DriveStore";
import * as mimeTypes from "mime-types";
import Folder from "@material-ui/icons/Folder";
import {style} from "typestyle/lib";
import Subject from "@material-ui/icons/Subject";
import Audiotrack from "@material-ui/icons/Audiotrack";
import Code from "@material-ui/icons/Code";
import Help from "@material-ui/icons/Help";
import Movie from "@material-ui/icons/Movie";
import Photo from "@material-ui/icons/Photo";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import type {RouterStore} from "mobx-react-router";
import TextTruncate from "react-text-truncate";
import {animation, contextMenu, Item, Menu, Separator} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import {COLORS} from "../../constants/Style";
import type {Location, UnregisterCallback} from "history";
import {classes} from "typestyle";
import {
    Breadcrumbs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField, Typography
} from "@material-ui/core";
import {TitleBar} from "../../../common/components/TitleBar";
import {Container} from "../../../common/components/Container";
import {Link} from "react-router-dom";
import {ValidatableTextField} from "../../components/ValidatableTextField";
import {FileDrop} from "react-file-drop";

interface IProps extends React.ClassAttributes<{}> {
    DriveStore?: DriveStore;
    RouterStore?: RouterStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    breadcrumbsContainer: style({
        padding: "0.5rem 1rem",
        borderRadius: "0 !important",
    }),
    link: style({
        color: COLORS.LightColor,
    }),
    dropContainer: style({
        display: "flex",
        flex: 1,
        $nest: {
            "& .file-drop-target": {
                display: "flex",
                flex: 1,
            },
        },
    }),
    hintText: style({
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        $nest: {
            "& > *": {
                color: COLORS.ExtraDarkGray,
            },
            "& > *:first-child": {
                marginBottom: "1rem",
            },
        },
    }),
    list: style({
        display: "flex",
        $nest: {
            "& > div": {
                width: 150,
            },
        },
    }),
    emptyList: style({
        flex: 1,
    }),
    item: style({
        border: "1px solid rgba(0, 0, 0, 0)",
    }),
    selectedItem: style({
        background: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(0, 0, 0, 0.3)",
    }),
    hoveredItem: style({
        background: "rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.2)",
    }),
    itemInner: style({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        height: "100%",
        $nest: {
            "& *": {
                overflowWrap: "break-word",
            }
        },
    }),
    onDragItemInner: style({
        opacity: 0.5,
    }),
    iconContainer: style({
        fontSize: 64,
        lineHeight: "1em", // NOTE: px指定だと吹き飛ぶ
    }),
    directory: style({
        color: COLORS.SuperExtraLightColor,
    }),
    file: style({
        position: "relative",
    }),
    fileBackgroundIcon: style({
        color: COLORS.EmotionalBlack,
    }),
    propertyIconContainer: style({
        display: "flex",
    }),
    icon: style({
        position: "absolute",
        left: 0,
        right: 0,
        top: "auto",
        bottom: 16,
        width: "100%",
        height: "50%",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        $nest: {
            "&>svg": {
                fontSize: "0.5em",
            },
        },
    }),
    textTruncate: style({
        textAlign: "center",
        overflowWrap: "break-word",
        width: "100%",
        height: "3em",
        lineHeight: "1.5em",
    }),
};

@inject("DriveStore", "RouterStore")
@observer
export class Drive extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.onPathChange = this.onPathChange.bind(this);
    }

    private unregisterFunc?: UnregisterCallback;

    public componentDidMount() {
        this.props.DriveStore!.getFile(this.locationPath());
        this.unregisterFunc = this.props.RouterStore!.history.listen(this.onPathChange);
    }

    public componentWillUnmount() {
        if (this.unregisterFunc) {
            this.unregisterFunc();
        }
    }

    private onPathChange(location: Location) {
        const dir = this.locationPath(location);
        if (this.props.DriveStore!.currentDir !== dir) {
            this.props.DriveStore!.getFile(dir);
        }
    }

    private locationPath(location?: Location) {
        if (!location) {
            location = this.props.RouterStore!.location;
        }
        let dir = location.pathname.replace("/drive", "");
        if (dir.startsWith("/")) {
            dir = dir.substring(1);
        }
        if (dir !== "" && !dir.endsWith("/")) {
            dir += "/";
        }
        return dir;
    }

    // REF: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
    private humanReadableFileSize(bytes: number, si: boolean) {
        const thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        const units = si
            ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        let unit = -1;
        do {
            bytes /= thresh;
            ++unit;
        } while(Math.abs(bytes) >= thresh && unit < units.length - 1);
        return bytes.toFixed(1)+' '+units[unit];
    }

    private renderIcon(file: IFileInfo) {
        const type = (mimeTypes.lookup(file.name) || "").split("/").shift();
        let icon;
        switch (type) {
            case "text":
                icon = <Subject/>;
                break;
            case "audio":
                icon = <Audiotrack/>;
                break;
            case "video":
                icon = <Movie/>;
                break;
            case "image":
                icon = <Photo/>;
                break;
            case "application":
                icon = <Code/>;
                break;
            default:
                icon = <Help/>;
                break;
        }

        let inner;
        if (file.type === FileType.DIRECTORY) {
            inner = <Folder fontSize={"inherit"} className={styles.directory}/>;
        } else {
            inner = (
                <div className={styles.file}>
                    <InsertDriveFile fontSize={"inherit"} className={styles.fileBackgroundIcon}/>
                    <div className={styles.icon}>{icon}</div>
                </div>
            );
        }

        return <div className={styles.iconContainer}>{inner}</div>;
    }

    private showContextMenu(event: React.MouseEvent<HTMLDivElement>, index: number) {
        event.preventDefault();
        event.stopPropagation();
        event.persist();

        this.props.DriveStore!.setSelectedIndex(index);
        contextMenu.show({
            id: "context-menu",
            event,
        });
    }

    private renderBreadcrumbs() {
        const paths = this.props.DriveStore!.currentDir.split("/");

        return (
            <Breadcrumbs>
                <Link key={"root"} to={`/drive`} className={styles.link}><Folder /></Link>
                {paths.map((path, index) => {
                    const to = paths.slice(0, index+1).join("/");

                    return <Link key={to} to={`/drive/${to}`} className={styles.link}>{path}</Link>;
                })}
            </Breadcrumbs>
        );
    }

    private renderFiles() {
        const files = this.props.DriveStore!.info;

        if (files.length === 0) {
            return (
                <div className={classes("upload-hint", styles.hintText)}>
                    <Typography display={"block"} variant={"h4"}>
                        ここにドロップしてファイルを追加
                    </Typography>
                    <Typography display={"block"} variant={"h6"}>
                        右クリックメニューでフォルダーを追加
                    </Typography>
                </div>
            )
        }

        return files.map((file: IFileInfo, index) => {
            return (
                <div
                    key={file.path}
                    draggable={true}
                    onDragStart={() => {
                        this.setState({
                            onInnerDrop: true,
                        });
                        this.props.DriveStore!.setSelectedIndex(index);
                        this.props.DriveStore!.setSource(Command.MOVE);
                    }}
                    onDragOver={() => {
                        if (this.props.DriveStore!.source.command === Command.MOVE && file.type === FileType.DIRECTORY) {
                            this.props.DriveStore!.setSelectedIndex(index);
                        }
                    }}
                    onDragEnd={() => {
                        this.props.DriveStore!.resetSource();
                    }}
                    onDrop={(event) => {
                        if (this.props.DriveStore!.source.command === Command.MOVE && file.type === FileType.DIRECTORY) {
                            event.preventDefault();
                            event.stopPropagation();

                            this.props.DriveStore!.setSelectedIndex(index);
                            this.props.DriveStore!.paste();
                        }
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (this.props.DriveStore!.selectedIndex === index) {
                            if (file.type === FileType.DIRECTORY) {
                                this.props.DriveStore!.getFile(file.path).then(() => {
                                    this.props.RouterStore!.push(`/drive/${this.props.DriveStore!.currentDir}`);
                                })
                            } else {
                                this.props.DriveStore!.open();
                            }
                        } else {
                            this.props.DriveStore!.setSelectedIndex(index);
                        }
                    }}
                    onContextMenu={(event) => {
                        event.preventDefault();
                        this.showContextMenu(event, index);
                    }}
                    onMouseEnter={() => this.props.DriveStore!.setHoveredIndex(index)}
                    onMouseLeave={() => this.props.DriveStore!.setHoveredIndex(-1)}
                    className={this.props.DriveStore!.selectedIndex === index ? styles.selectedItem : this.props.DriveStore!.hoveredIndex === index ? styles.hoveredItem : styles.item}
                >
                    <div className={classes(styles.itemInner, this.props.DriveStore!.source.command === Command.MOVE && this.props.DriveStore!.source!.path === file.path && styles.onDragItemInner)}>
                        <div className={styles.iconContainer}>
                            {this.renderIcon(file)}
                        </div>
                        <TextTruncate
                            line={2}
                            text={file.name}
                            containerClassName={styles.textTruncate}
                        />
                    </div>
                </div>
            );
        })
    }

    public renderContextMenu() {
        return (
            <Menu id={"context-menu"} animation={animation.fade}>
                {this.props.DriveStore!.selectedInfo?.type === FileType.NONE ?
                    <>
                        <Item onClick={() => this.props.DriveStore!.getFile(this.props.DriveStore!.currentDir)}>
                            最新の状態に更新
                        </Item>
                        <Separator/>
                        <Item disabled={this.props.DriveStore!.source?.command === Command.NONE} onClick={() => this.props.DriveStore!.paste()}>
                            貼り付け
                        </Item>
                        <Item onClick={() => {
                            this.props.DriveStore!.setEditName("");
                            this.props.DriveStore!.setShowMkDirDialog(true);
                        }}>
                            フォルダーを作成
                        </Item>
                    </> :
                    <>
                        <Item onClick={() => this.props.DriveStore!.setSource(Command.COPY)}>
                            コピー
                        </Item>
                        <Item onClick={() => this.props.DriveStore!.setSource(Command.MOVE)}>
                            切り取り
                        </Item>
                        <Separator/>
                        <Item
                            onClick={() => {
                                this.props.DriveStore!.setSource(Command.DELETE);
                                this.props.DriveStore!.setShowDeleteConfirmDialog(true);
                            }}
                        >
                            削除
                        </Item>
                        <Item onClick={() => {
                            this.props.DriveStore!.setSource(Command.MOVE);
                            this.props.DriveStore!.setEditName(this.props.DriveStore!.selectedInfo!.name);
                            this.props.DriveStore!.setShowEditNameDialog(true);
                        }}>
                            名前の変更
                        </Item>
                        {this.props.DriveStore!.selectedInfo?.type === FileType.FILE ?
                            <>
                                <Item disabled={false} onClick={() => this.props.DriveStore!.open(true)}>
                                    ダウンロード
                                </Item>
                            </> :
                            <></>
                        }
                        <Separator/>
                        <Item disabled={false} onClick={() => this.props.DriveStore!.setShowPropertyDialog(true)}>
                            プロパティー
                        </Item>

                    </>
                }
            </Menu>
        );
    }

    public renderDeleteConfirmDialog() {
        if (!this.props.DriveStore!.selectedInfo) {
            return <></>;
        }
        return (
            <Dialog open={this.props.DriveStore!.showDeleteConfirmDialog}>
                <DialogTitle>削除</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <p>この操作は取り消せません。</p>
                        <p>本当に<code>{this.props.DriveStore!.selectedInfo.name}</code>を削除してもいいですか？</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={() => this.props.DriveStore!.delete()}
                    >
                        OK
                    </Button>
                    <Button
                        autoFocus
                        onClick={() => {
                            this.props.DriveStore!.resetSource();
                            this.props.DriveStore!.setShowDeleteConfirmDialog(false);
                        }}
                    >
                        キャンセル
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    public renderMkDirDialog() {
        if (!this.props.DriveStore!.selectedInfo) {
            return <></>;
        }
        return (
            <Dialog open={this.props.DriveStore!.showMkDirDialog} maxWidth={"sm"} fullWidth={true}>
                <DialogTitle>フォルダー作成</DialogTitle>
                <DialogContent>
                    <ValidatableTextField
                        autoFocus
                        label={"フォルダー名"}
                        fullWidth={true}
                        validators={[{errorText: "/ を含むことはでできません", isValid: (text) => !text.includes("/")}]}
                        value={this.props.DriveStore!.editName}
                        onChangeValue={(e) => this.props.DriveStore!.setEditName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => this.props.DriveStore!.mkDir()}
                    >
                        作成
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.DriveStore!.setEditName("");
                            this.props.DriveStore!.setShowMkDirDialog(false);
                        }}
                    >
                        キャンセル
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    public renderEditNameDialog() {
        if (!this.props.DriveStore!.selectedInfo) {
            return <></>;
        }
        return (
            <Dialog open={this.props.DriveStore!.showEditNameDialog} maxWidth={"sm"} fullWidth={true}>
                <DialogTitle>名前の変更</DialogTitle>
                <DialogContent>
                    <ValidatableTextField
                        autoFocus
                        label={"新しい名前"}
                        fullWidth={true}
                        validators={[{errorText: "/ を含むことはでできません", isValid: (text) => !text.includes("/")}]}
                        value={this.props.DriveStore!.editName}
                        onChangeValue={(e) => this.props.DriveStore!.setEditName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => this.props.DriveStore!.rename()}
                    >
                        作成
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.DriveStore!.setEditName("");
                            this.props.DriveStore!.resetSource();
                            this.props.DriveStore!.setShowEditNameDialog(false);
                        }}
                    >
                        キャンセル
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    public renderPropertyDialog() {
        if (!this.props.DriveStore!.selectedInfo) {
            return <></>;
        }

        const info = this.props.DriveStore!.selectedInfo;
        return (
            <Dialog open={this.props.DriveStore!.showPropertyDialog} maxWidth={"sm"} fullWidth={true}>
                <DialogTitle>プロパティー</DialogTitle>
                <DialogContent>
                    <div className={styles.propertyIconContainer}>
                        {this.renderIcon(info)}
                    </div>
                        <TextField disabled={true} fullWidth={true} margin={"normal"} label={info.type === FileType.DIRECTORY ? "フォルダー名" : "ファイル名"} value={info.name}/>
                        <TextField disabled={true} fullWidth={true} margin={"normal"} label={"パス"} value={info.path}/>
                        <TextField disabled={true} fullWidth={true} margin={"normal"} label={"サイズ"} value={this.humanReadableFileSize(info.size, true)}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => this.props.DriveStore!.setShowPropertyDialog(false)}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    public render() {
        return (
            <>
                <TitleBar>ドライブ</TitleBar>
                <Paper elevation={2} className={styles.breadcrumbsContainer}>
                    {this.renderBreadcrumbs()}
                </Paper>
                <FileDrop
                    className={styles.dropContainer}
                    onDrop={(files, event) => {
                        event.preventDefault();
                        if (files) {
                            this.props.DriveStore!.upload(files);
                        }
                    }}
                >
                    <Container
                        onClick={() => {
                            this.props.DriveStore!.setSelectedIndex(-1);
                        }}
                        onContextMenu={(event) => {
                            event.preventDefault();
                            this.showContextMenu(event, -1);
                        }}
                    >
                        <div className={classes(styles.list, this.props.DriveStore!.info.length === 0 && styles.emptyList)}>
                            {this.renderFiles()}
                        </div>
                    </Container>
                </FileDrop>
                {this.renderContextMenu()}
                {this.renderDeleteConfirmDialog()}
                {this.renderMkDirDialog()}
                {this.renderEditNameDialog()}
                {this.renderPropertyDialog()}
            </>
        );
    }
}