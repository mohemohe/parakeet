import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {ValidatableTextField} from "../../../components/ValidatableTextField";
import {FormControl, Button} from "@material-ui/core";
import {style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";

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
export class NotifySetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getNotifyMastodon();
    }

    public render() {
        const notifyMastodon = this.props.SettingsStore!.notifyMastodon;

        return (
            <div>
                <TitleBar>投稿通知</TitleBar>
                <FormControl className={styles.control}>
                    <ValidatableTextField
                        label={"ベースURL"}
                        helperText={"https://mstdn.maud.io など"}
                        fullWidth={true}
                        validators={[]}
                        onChangeValue={(event) => this.props.SettingsStore!.setNotifyMastodon({...notifyMastodon, baseurl: event.target.value})}
                        value={notifyMastodon.baseurl}
                        InputLabelProps={{shrink: true}}/>
                </FormControl>
                <FormControl className={styles.control}>
                    <ValidatableTextField
                        label={"アクセストークン"}
                        fullWidth={true}
                        validators={[]}
                        onChangeValue={(event) => this.props.SettingsStore!.setNotifyMastodon({...notifyMastodon, token: event.target.value})}
                        value={notifyMastodon.token}
                        InputLabelProps={{shrink: true}}/>
                </FormControl>
                <FormControl className={styles.control}>
                    <ValidatableTextField
                        label={"テンプレート"}
                        helperText={"%ENTRY_TITLE% でタイトル, %ENTRY_URL% でエントリーのURL"}
                        fullWidth={true}
                        validators={[]}
                        onChangeValue={(event) => this.props.SettingsStore!.setNotifyMastodon({...notifyMastodon, template: event.target.value})}
                        value={notifyMastodon.template}
                        InputLabelProps={{shrink: true}}/>
                </FormControl>
                <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => this.props.SettingsStore!.putNotifyMastodon()}>保存</Button>
            </div>
        );
    }
}