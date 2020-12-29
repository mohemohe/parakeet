import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {FormControl, Button, Box, Typography} from "@material-ui/core";
import {classes, style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import { CodeFlaskReact } from "react-codeflask";
import Card from "@material-ui/core/Card";

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
    button: style({
        marginTop: "1rem",
    }),
    codeflask: style({
        $nest: {
            "& > div": {
                flex: 1,

            },
        },
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
                <Box display={"flex"} flex={1} flexDirection={"column"}>
                    <Typography variant="h6" gutterBottom>
                        カスタムCSS
                    </Typography>
                    <Card elevation={2} className={classes(styles.control)}>
                    <FormControl className={classes(styles.control, styles.codeflask)}>
                        <CodeFlaskReact
                            code={customCss}
                            onChange={(css: string) => this.props.SettingsStore!.setCustomCss(css)}
                        />
                    </FormControl>
                    </Card>
                </Box>
                <Box>
                    <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => {
                        this.props.SettingsStore!.putCustomCss();
                    }}>保存</Button>
                </Box>
            </>
        );
    }
}