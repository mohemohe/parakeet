import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {ValidatableTextField} from "../../../components/ValidatableTextField";
import {FormControl, Button, Typography, Box} from "@material-ui/core";
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
        this.props.SettingsStore!.getNotifyMisskey();
    }

    public render() {
        const { notifyMastodon, notifyMisskey } = this.props.SettingsStore!;

        return (
            <div>
                <TitleBar>投稿通知</TitleBar>

                <Box marginBottom={4}>
                    <Typography variant="h6" gutterBottom>
                        Mastodon / Pleroma
                    </Typography>
                    <FormControl className={styles.control}>
                        <ValidatableTextField
                            label={"ベースURL"}
                            placeholder={"https://mstdn.maud.io など"}
                            helperText={"空にすると通知を無効化します"}
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
                </Box>

                <Box marginBottom={4}>
                    <Typography variant="h6">
                        Misskey
                    </Typography>
                    <FormControl className={styles.control}>
                        <ValidatableTextField
                            label={"ベースURL"}
                            placeholder={"https://miwkey.miwpayou0808.info など"}
                            helperText={"空にすると通知を無効化します"}
                            fullWidth={true}
                            validators={[]}
                            onChangeValue={(event) => this.props.SettingsStore!.setNotifyMisskey({...notifyMisskey, baseurl: event.target.value})}
                            value={notifyMisskey.baseurl}
                            InputLabelProps={{shrink: true}}/>
                    </FormControl>
                    <FormControl className={styles.control}>
                        <ValidatableTextField
                            label={"アクセストークン"}
                            fullWidth={true}
                            validators={[]}
                            onChangeValue={(event) => this.props.SettingsStore!.setNotifyMisskey({...notifyMisskey, token: event.target.value})}
                            value={notifyMisskey.token}
                            InputLabelProps={{shrink: true}}/>
                    </FormControl>
                    <FormControl className={styles.control}>
                        <ValidatableTextField
                            label={"テンプレート"}
                            helperText={"%ENTRY_TITLE% でタイトル, %ENTRY_URL% でエントリーのURL"}
                            fullWidth={true}
                            validators={[]}
                            onChangeValue={(event) => this.props.SettingsStore!.setNotifyMisskey({...notifyMisskey, template: event.target.value})}
                            value={notifyMisskey.template}
                            InputLabelProps={{shrink: true}}/>
                    </FormControl>
                </Box>

                <Box display={"flex"} justifyContent={"flex-end"}>
                    <Button
                        className={styles.button}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            this.props.SettingsStore!.putNotifyMastodon();
                            this.props.SettingsStore!.putNotifyMisskey();
                        }}>
                            保存
                    </Button>
                </Box>
            </div>
        );
    }
}
