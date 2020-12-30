import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {Button, Switch, FormControlLabel, TextField, Box} from "@material-ui/core";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {State} from "../../../stores/StoreBase";
import {Container} from "../../../../common/components/Container";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
}

@inject("AuthStore", "SettingsStore")
@observer
export class RenderSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getRender();
    }

    public render() {
        const store = this.props.SettingsStore!;
        const { entries, entry, timeout } = store.render;
        const loading = this.props.SettingsStore!.state === State.RUNNING;

        return (
            <>
                <TitleBar>サーバーサイドレンダリング</TitleBar>
                <Container>
                    <Box marginBottom={2}>
                        <FormControlLabel
                            disabled={loading}
                            control={
                                <Switch
                                    checked={entries}
                                    onChange={(event) => store.setRender({...store.render, entries: event.target.checked})}
                                    color="primary"
                                />
                            }
                            label="エントリーリスト"
                        />
                    </Box>

                    <Box marginBottom={3}>
                        <FormControlLabel
                            disabled={loading}
                            control={
                                <Switch
                                    checked={entry}
                                    onChange={(event) => store.setRender({...store.render, entry: event.target.checked})}
                                    color="primary"
                                />
                            }
                            label="エントリー"
                        />
                    </Box>

                    <Box marginBottom={4} display={"grid"}>
                        <TextField
                            label="タイムアウト(ms)"
                            value={timeout || 3000}
                            onChange={(event) => {
                                let value = parseInt(event.target.value, 10);
                                if (value < 100) {
                                    value = 100;
                                }
                                if (value > 10000) {
                                    value = 10000;
                                }
                                store.setRender({ ...store.render, timeout: value });
                            }}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                inputProps: {
                                    min: 100,
                                    max: 10000,
                                }
                            }}
                            helperText={"最小: 100, 最大: 10000"}
                        />
                    </Box>

                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button variant={"contained"} color={"primary"} onClick={() => this.props.SettingsStore!.putRender()} disabled={loading}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}