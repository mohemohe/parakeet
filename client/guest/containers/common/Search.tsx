import React from "react";
import {inject, observer} from "mobx-react";
import {style} from "typestyle";
import type {RouterStore} from "mobx-react-router";
import type {SearchStore} from "../../stores/SearchStore";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
import {State} from "../../stores/StoreBase";

interface IProps {
    RouterStore?: RouterStore;
    SearchStore?: SearchStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    button: style({
        position: "fixed !important" as "fixed",
        right: 18,
        bottom: 18,
        zIndex: 100,
    }),
    dialog: style({
        $nest: {
            "& .MuiPaper-root": {
                width: 640,
                maxWidth: "calc(100% - 36px)",
            },
        },
    }),
};

@inject("RouterStore", "SearchStore")
@observer
export class Search extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        const { entries, info, state } = this.props.SearchStore!;
        return (
            <>
                <Fab className={styles.button} color={"primary"}  onClick={() => this.props.SearchStore!.toggleShowModal(true)}>
                    <SearchOutlined />
                </Fab>
                <Dialog className={styles.dialog} open={this.props.SearchStore!.showModal}>
                    <DialogTitle>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                            <Typography variant={"h6"}>エントリー検索</Typography>
                            <IconButton onClick={() => this.props.SearchStore!.toggleShowModal(false)}>
                                <CloseOutlined/>
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="キーワード"
                            fullWidth
                            helperText={"半角スペース区切りでAND条件, Enterキーで検索"}
                            onChange={(e) => this.props.SearchStore!.setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.keyCode === 13 && this.props.SearchStore!.getEntries() }
                        />
                        {
                            state === State.RUNNING && (
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} m={6}>
                                    <CircularProgress />
                                </Box>
                            )
                        }
                        {
                            entries.length > 0 && (
                                <>
                                    <List>
                                        {
                                            entries.map((entry) => {
                                                const lines = entry.body.split("\n").filter((line) => line !== "");
                                                return (
                                                    <ListItem button onClick={() => {
                                                        this.props.RouterStore!.history.push(`/entry/${entry._id}`);
                                                        this.props.SearchStore!.toggleShowModal(false);
                                                    }}>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant={"h6"} noWrap={true}>
                                                                    {entry.title}
                                                                </Typography>
                                                            }
                                                            secondary={[lines.shift(), lines.shift(), lines.shift()].map((line) => <Typography variant={"body2"} noWrap={true}>{(line || "")+""}</Typography>)}
                                                        />
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"}>
                                        <Typography variant={"caption"}>
                                            {info.recordsOnPage > entries.length ? entries.length : info.recordsOnPage}件 / {info.totalRecords}件
                                        </Typography>
                                    </Box>
                                </>
                            )
                        }
                        {
                            info.totalRecords === 0 && (
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} m={6}>
                                    <Box marginBottom={2}>
                                        <Typography variant={"h6"}>
                                            エントリーが見つかりませんでした
                                        </Typography>
                                    </Box>
                                    <Typography variant={"body1"}>
                                        キーワードを変えて再度試してみてください。
                                    </Typography>
                                </Box>
                            )
                        }
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}
