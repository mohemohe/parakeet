import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {Button, Switch, FormControlLabel} from "@material-ui/core";
import {style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {State} from "../../../stores/StoreBase";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    control: style({
        display: "block",
    }),
    button: style({
        marginTop: "1rem",
    }),
};

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
        const {entries, entry} = this.props.SettingsStore!.render;
        const loading = this.props.SettingsStore!.state === State.RUNNING;

        return (
            <div>
                <TitleBar>サーバーサイドレンダリング</TitleBar>
                <FormControlLabel
                    className={styles.control}
                    disabled={loading}
                    control={
                        <Switch
                            checked={entries}
                            onChange={(event) => this.props.SettingsStore!.setRender({...this.props.SettingsStore!.render, entries: event.target.checked})}
                            color="primary"
                        />
                    }
                    label="エントリーリスト"
                />
                <FormControlLabel
                    className={styles.control}
                    disabled={loading}
                    control={
                        <Switch
                            checked={entry}
                            onChange={(event) => this.props.SettingsStore!.setRender({...this.props.SettingsStore!.render, entry: event.target.checked})}
                            color="primary"
                        />
                    }
                    label="エントリー"
                />
                <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => this.props.SettingsStore!.putRender()} disabled={loading}>保存</Button>
            </div>
        );
    }
}