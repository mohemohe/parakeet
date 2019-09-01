import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {Entry} from "../../components/Entry";
import {style} from "typestyle";
import {RouteComponentProps} from "react-router-dom";

interface IProps extends RouteComponentProps<{id: string}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
        $nest: {
            "& :first-child": {
                marginTop: 0,
            },
            "& :last-child": {
                marginBottom: 0,
            },
        }
    }),
};

@inject("EntryStore")
@observer
export class SingleEntry extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.EntryStore!.getEntry(this.props.match.params.id);
    }

    public render() {
        return (
            <div className={styles.root}>
                <Entry entry={this.props.EntryStore!.entry} stopToReadMore={false} syntaxHighlighting={!this.props.EntryStore!.isSSR}/>
            </div>
        );
    }
}