import * as React from "react";
import {inject, observer} from "mobx-react";
import {EntryStore} from "../../stores/EntryStore";
import {style} from "typestyle";
import {EmotionalCard} from "../../components/EmotionalCard";
import ReactMarkdown from "react-markdown";

interface IProps extends React.ComponentClass<HTMLDivElement> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
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
        const contents = [
            "<h1>うんこ</h1>",
            "<marquee>うんこ</marquee>",
            "<s>うんこ</s>"
        ];
        return (
            <div className={styles.root}>
                {contents.map((content, index) => {
                    return (
                        <EmotionalCard>
                            <ReactMarkdown
                                key={index}
                                source={content}
                                className={`markdown-body`}
                                escapeHtml={false}
                            />
                        </EmotionalCard>
                    );
                })}
            </div>
        );
    }
}