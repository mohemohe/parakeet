import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {Button, Switch, FormControlLabel, Typography, FormControl, Box} from "@material-ui/core";
import {style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {State} from "../../../stores/StoreBase";
import {ValidatableTextField} from "../../../components/ValidatableTextField";
import {Container} from "../../../../common/components/Container";

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
export class CacheSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getMongoDbQueryCache();
        this.props.SettingsStore!.getSsrPageCache();
        this.props.SettingsStore!.getCloudflare();
    }

    public render() {
        const {mongoDbQueryCache, ssrPageCache, cloudflare} = this.props.SettingsStore!;
        const loading = this.props.SettingsStore!.state === State.RUNNING;

        return (
            <>
                <TitleBar>キャッシュ</TitleBar>
                <Container>
                    <Box marginBottom={2}>
                        <Typography variant="h6" gutterBottom>
                            組み込み
                        </Typography>
                        <FormControlLabel
                            className={styles.control}
                            disabled={loading}
                            control={
                                <Switch
                                    checked={mongoDbQueryCache}
                                    onChange={(event) => this.props.SettingsStore!.setMongoDbQueryCache(event.target.checked)}
                                    color="primary"
                                />
                            }
                            label="MongoDBのクエリーをキャッシュする"
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <FormControlLabel
                            className={styles.control}
                            disabled={loading || true}
                            control={
                                <Switch
                                    checked={ssrPageCache}
                                    onChange={(event) => this.props.SettingsStore!.setSsrPageCache(event.target.checked)}
                                    color="primary"
                                />
                            }
                            label="SSR済みページをキャッシュする (TBD)"
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Typography variant="h6" gutterBottom>
                            Cloudflare
                        </Typography>
                        <FormControlLabel
                            className={styles.control}
                            disabled={loading}
                            control={
                                <Switch
                                    checked={cloudflare.enable}
                                    onChange={(event) => this.props.SettingsStore!.setCloudflare({...cloudflare, enable: event.target.checked})}
                                    color="primary"
                                />
                            }
                            label="投稿時にCloudflareのキャッシュを削除する"
                        />
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"Zone ID"}
                                fullWidth={true}
                                disabled={!cloudflare.enable}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setCloudflare({...cloudflare, zone_id: event.target.value})}
                                value={cloudflare.zone_id}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"API token"}
                                fullWidth={true}
                                disabled={!cloudflare.enable}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setCloudflare({...cloudflare, api_token: event.target.value})}
                                value={cloudflare.api_token}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => {
                            this.props.SettingsStore!.putMongoDbQueryCache();
                            // this.props.SettingsStore!.putSsrPageCache();
                            this.props.SettingsStore!.putCloudflare();
                        }} disabled={loading}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}