import React from "react";
import {inject, observer} from "mobx-react";
import {style} from "typestyle";
import type {RouterStore} from "mobx-react-router";
import type {SearchStore} from "../../stores/SearchStore";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
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
        return <>
            <Fab className={styles.button} color={"primary"}  onClick={() => this.props.SearchStore!.toggleShowModal(true)}>
                <SearchOutlined />
            </Fab>
            <Dialog className={styles.dialog} open={this.props.SearchStore!.showModal}>
                <DialogTitle>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={"h6"}>エントリー検索</Typography>
                        <IconButton
                            onClick={() => this.props.SearchStore!.toggleShowModal(false)}
                            size="large">
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
        </>;
    }
}
