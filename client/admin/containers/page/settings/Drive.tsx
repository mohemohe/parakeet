import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {ValidatableTextField} from "../../../components/ValidatableTextField";
import {FormControl, Button, Typography, Box, IconButton, InputAdornment} from "@material-ui/core";
import {style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {Container} from "../../../../common/components/Container";
import {Visibility, VisibilityOff} from "@material-ui/icons";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
    showAccessSecretKey: boolean;
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
export class DriveSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            showAccessSecretKey: false,
        };
    }

    public componentDidMount() {
        this.props.SettingsStore!.getS3();
    }

    public render() {
        const { s3 } = this.props.SettingsStore!;

        return (
            <>
                <TitleBar>ドライブ</TitleBar>
                <Container>
                    <Box marginBottom={4}>
                        <Typography variant="h6" gutterBottom>
                            AWS S3
                        </Typography>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"リージョン"}
                                placeholder={"ap-northeast-1 など"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setS3({ region: event.target.value })}
                                value={s3.region}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"バケット名"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setS3({ bucket: event.target.value })}
                                value={s3.bucket}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"Access Key ID"}
                                helperText={"空にするとIAM Roleで認証を行います"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setS3({ access_key_id: event.target.value })}
                                value={s3.access_key_id}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"Access Secret Key"}
                                helperText={"空にするとIAM Roleで認証を行います"}
                                type={this.state.showAccessSecretKey ? "text" : "password"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setS3({ access_secret_key: event.target.value })}
                                value={s3.access_secret_key}
                                InputLabelProps={{shrink: true}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => this.setState({ showAccessSecretKey: !this.state.showAccessSecretKey })}>
                                                {this.state.showAccessSecretKey ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </FormControl>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"エンドポイント"}
                                helperText={"MinIOなどのS3互換オブジェクト ストレージを使用する場合に指定します"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.SettingsStore!.setS3({ endpoint: event.target.value })}
                                value={s3.endpoint}
                                InputLabelProps={{shrink: true}}/>
                        </FormControl>
                    </Box>

                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button
                            className={styles.button}
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                this.props.SettingsStore!.putS3();
                            }}>
                            保存
                        </Button>
                    </Box>
                </Container>
            </>
        );
    }
}
