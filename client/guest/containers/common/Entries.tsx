import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import Paper from "@material-ui/core/Paper";
import ReactMarkdown from "react-markdown";
import {style} from "typestyle";
import {COLORS} from "../../constants/Style";

interface IProps extends React.ClassAttributes<{}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
        "margin": "1rem",
    }),
    title: style({
        "padding": "1rem",
        "background": COLORS.BaseColor,
        "color": COLORS.EmotionalWhite,
        "borderRadius": "4px 4px 0 0",
    }),
    body: style({
        "padding": "1rem",
    }),
};

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
            <>
                {this.props.EntryStore!.entries.map((entry) => {
                    return (
                        <Paper className={styles.root}>
                            <h1 className={styles.title}>{entry.title}</h1>
                            <ReactMarkdown source={entry.body} className={`markdown-body ${styles.body}`} escapeHtml={false}/>
                        </Paper>
                    )
                })}
            </>
        );
    }
}