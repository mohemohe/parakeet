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
export class CacheSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getMongoDbQueryCache();
        this.props.SettingsStore!.getSsrPageCache();
    }

    public render() {
        const {mongoDbQueryCache, ssrPageCache} = this.props.SettingsStore!;
        const loading = this.props.SettingsStore!.state === State.RUNNING;

        return (
            <div>
                <TitleBar>キャッシュ</TitleBar>
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
                <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => {
                    this.props.SettingsStore!.putMongoDbQueryCache();
                    // this.props.SettingsStore!.putSsrPageCache();
                }} disabled={loading}>保存</Button>
            </div>
        );
    }
}