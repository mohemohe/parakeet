import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {Entry} from "../../components/Entry";
import {style} from "typestyle";
import {LinkButton} from "../../../common/components/LinkButton";
import {RouteComponentProps} from "react-router";

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
    pager: style({
        display: "flex",
        justifyContent: "space-between",
    }),
};

@inject("EntryStore")
@observer
export class Entries extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        const page = parseInt(`${this.props.match.params.id || 1}`, 10);
        this.props.EntryStore!.getEntries(page);
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        if (this.props.match.params.id != nextProps.match.params.id) {
            const page = parseInt(`${nextProps.match.params.id || 1}`, 10);
            this.props.EntryStore!.getEntries(page);
        }
    }

    public render() {
        const page = parseInt(`${this.props.match.params.id || 1}`, 10);

        return (
            <div className={styles.root}>
                {this.props.EntryStore!.entries.map((entry) => <Entry entry={entry} stopToReadMore={true}/>)}

                <div className={styles.pager}>
                    {page > 1 ?
                        <LinkButton to={`/entries/${page - 1}`} buttonProps={{variant: "contained", color: "primary"}}>新しい投稿</LinkButton> :
                        <div/>
                    }
                    {this.props.EntryStore!.info.totalPages > page ?
                        <LinkButton to={`/entries/${page + 1}`} buttonProps={{variant: "contained", color: "primary"}}>古い投稿</LinkButton> :
                        <div/>
                    }
                </div>
            </div>
        );
    }
}