import * as React from "react";
import {inject, observer} from "mobx-react";
import {style} from "typestyle";
import {RouterStore} from "mobx-react-router";
import {SearchStore} from "../../stores/SearchStore";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab, IconButton, List, ListItem, ListItemText,
    TextField, Typography
} from "@material-ui/core";
import {CloseOutlined} from "@material-ui/icons";

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
                            this.props.SearchStore!.entries.length > 0 && (
                                <List>
                                    {
                                        this.props.SearchStore!.entries.map((entry) => {
                                            const lines = entry.body.split("\n");
                                            return (
                                                <ListItem button onClick={() => {
                                                    this.props.RouterStore!.history.push(`/entry/${entry._id}`);
                                                    this.props.SearchStore!.toggleShowModal(false);
                                                }}>
                                                    <ListItemText
                                                        primary={entry.title}
                                                        secondary={[lines.shift(), lines.shift(), lines.shift()].map((line) => <div>{line+""}</div>)}
                                                    />
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                            )
                        }
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}
