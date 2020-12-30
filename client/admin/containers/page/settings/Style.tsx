import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {FormControl, Button, Box, Typography} from "@material-ui/core";
import {classes, style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {Container} from "../../../../common/components/Container";
import {CodeFlask} from "../../../components/CodeFlask";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    control: style({
        display: "flex",
        flex: 1,
    }),
};

@inject("AuthStore", "SettingsStore")
@observer
export class StyleSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getCustomCss();
    }

    public render() {
        const { customCss } = this.props.SettingsStore!;

        return (
            <>
                <TitleBar>外観</TitleBar>
                <Container>
                    <Box display={"flex"} flex={1} flexDirection={"column"} marginBottom={2}>
                        <Typography variant="h6" gutterBottom>
                            カスタムCSS
                        </Typography>
                        <FormControl className={classes(styles.control)}>
                            <CodeFlask
                                elevation={2}
                                value={customCss}
                                options={{
                                    language: "css",
                                    lineNumbers: true,
                                    handleTabs: true,
                                    tabSize: 2,
                                }}
                                onUpdate={(css: string) => this.props.SettingsStore!.setCustomCss(css)}
                            />
                        </FormControl>
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button variant={"contained"} color={"primary"} onClick={() => {
                            this.props.SettingsStore!.putCustomCss();
                        }}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}