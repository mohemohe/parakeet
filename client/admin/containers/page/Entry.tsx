import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {AutoTable} from "../../components/AutoTable";
import {LinkButton} from "../../../common/components/LinkButton";

interface IProps extends React.ClassAttributes<{}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

@inject("EntryStore")
@observer
export class Entry extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.EntryStore!.getEntries(0);
    }

    public render() {
        return (
            <div>
                <h2>エントリー</h2>
                <LinkButton to={"/entries/new"} buttonProps={{variant: "raised", color: "primary"}}>作成</LinkButton>
                <AutoTable items={this.props.EntryStore!.editableEntries} order={["_id", "title", "body", "path"]} replacer={new Map<string, string>([["_id", "ID"], ["title", "タイトル"], ["body", "本文"], ["path", " "]])}/>
            </div>
        );
    }
}