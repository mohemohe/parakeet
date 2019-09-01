import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {style} from "typestyle";
import {EmotionalCard} from "../../components/EmotionalCard";

interface IProps extends React.ComponentClass<HTMLDivElement> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
        marginLeft: "1rem",
        $nest: {
            "& div": {
                margin: "1rem 0",
            },
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
export class SideColumn extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
    }

    public render() {
        return (
            <div className={styles.root}>
                <EmotionalCard>
                    うんこ<br/>
                    うんこ<br/>
                    うんこ<br/>
                </EmotionalCard>
                <EmotionalCard>
                    うんこ<br/>
                    うんこ<br/>
                    うんこ<br/>
                </EmotionalCard>
                <EmotionalCard>
                    うんこ<br/>
                    うんこ<br/>
                    うんこ<br/>
                </EmotionalCard>
                <EmotionalCard>
                    うんこ<br/>
                    うんこ<br/>
                    うんこ<br/>
                </EmotionalCard>
                <EmotionalCard>
                    うんこ<br/>
                    うんこ<br/>
                    うんこ<br/>
                </EmotionalCard>
            </div>
        );
    }
}