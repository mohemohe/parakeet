import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {LinkButton} from "../../../common/components/LinkButton";
import {TitleBar} from "../../../common/components/TitleBar";
import {Paper} from "@material-ui/core";


interface IProps extends React.ClassAttributes<{}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

@inject("EntryStore")
@observer
export class Entries extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.index = 1;
    }

    private index: number;

    public componentDidMount() {
        this.props.EntryStore!.getEntries(this.index);
    }

    public get back() {
        return this.index === 1 ? 1 : --this.index;
    }

    public get forward() {
        return ++this.index;
    }

    public render() {
        return (
            <div>
                {this.props.EntryStore!.entries.map((entry) => {
                    return (
                        <Paper>
                            {JSON.stringify(entry)}
                        </Paper>
                    )
                })}
            </div>
        );
    }
}