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
export class SiteSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getSiteTitle();
    }

    public render() {
        const siteTitle = this.props.SettingsStore!.siteTitle;

        return (
            <div>
                <TitleBar>サイト情報</TitleBar>
                <FormControl className={styles.control}>
                    <ValidatableTextField label={"タイトル"} fullWidth={true} validators={[]} onChangeValue={(event) => this.props.SettingsStore!.setSiteTitle(event.target.value)} value={siteTitle} InputLabelProps={{shrink: true}}/>
                </FormControl>
                <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => this.props.SettingsStore!.putSiteTitle()}>保存</Button>
            </div>
        );
    }
}