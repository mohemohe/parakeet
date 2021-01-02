import * as React from "react";
import {inject, observer} from "mobx-react";
import {DriveStore} from "../../stores/DriveStore";
import {AutoTable} from "../../components/AutoTable";
import {LinkButton} from "../../../common/components/LinkButton";
import {TitleBar} from "../../../common/components/TitleBar";
import {Container} from "../../../common/components/Container";
import {Box, Typography} from "@material-ui/core";


interface IProps extends React.ClassAttributes<{}> {
    DriveStore?: DriveStore;
}

interface IState extends React.ComponentState {
}

@inject("DriveStore")
@observer
export class Drive extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.DriveStore!.getFile("");
    }

    public render() {
        return (
            <>
                <TitleBar>ドライブ</TitleBar>
                <Container>
                    <Box display={"flex"} justifyContent={"flex-end"} marginBottom={2}>
                        <LinkButton to={"/entries/new"} buttonProps={{variant: "contained", color: "primary"}}>作成</LinkButton>
                    </Box>
                    <AutoTable
                        items={this.props.DriveStore!.info}
                        // order={["_id", "title", "_find_count", "_draft", "_created", "_modified", "path"]}
                        // replacer={new Map<string, string>([["_id", "ID"], ["title", "タイトル"], ["_find_count", "表示回数"], ["_draft", "下書き"], ["_created", "作成日時"], ["_modified", "更新日時"], ["path", " "]])}
                        // onClickBack={() => this.props.EntryStore!.getEntries(this.back)}
                        // onClickForward={() => this.props.EntryStore!.getEntries(this.forward)}
                        // disableBackButton={this.index === 1}
                        // disableForwardButton={this.index === this.props.EntryStore!.info.totalPages}
                    />
                    <Box>
                        <Typography variant={"caption"}>
                            表示回数は個別ページにアクセスされた段階でカウントされます
                        </Typography>
                    </Box>
                </Container>
            </>
        );
    }
}