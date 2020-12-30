import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {Button, Box, Typography, FormControlLabel, Switch} from "@material-ui/core";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {Container} from "../../../../common/components/Container";
import {State} from "../../../stores/StoreBase";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
}

@inject("AuthStore", "SettingsStore")
@observer
export class SearchSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getMongoDbSearch();
    }

    public render() {
        const loading = this.props.SettingsStore!.state === State.RUNNING;
        const store = this.props.SettingsStore!;
        const { mongoDbSearch } = store;

        return (
            <>
                <TitleBar>検索</TitleBar>
                <Container>
                    <Box display={"flex"} flexDirection={"column"} marginBottom={2}>
                        <Typography variant="h6" gutterBottom>
                            MongoDB
                        </Typography>
                        <Box marginBottom={2}>
                            <FormControlLabel
                                disabled={loading}
                                control={
                                    <Switch
                                        checked={mongoDbSearch === "regex"}
                                        onChange={(event) => store.setMongoDbSearch(event.target.checked ? "regex" : "")}
                                        color="primary"
                                    />
                                }
                                label="正規表現での記事検索をゲストに許可する"
                            />
                        </Box>
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button variant={"contained"} color={"primary"} onClick={() => {
                            this.props.SettingsStore!.putMongoDbSearch();
                        }}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}