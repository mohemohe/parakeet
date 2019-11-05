import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../stores/SettingsStore";
import {style} from "typestyle";
import {EmotionalCard} from "../../components/EmotionalCard";
import ReactMarkdown from "react-markdown";

const breaks = require("remark-breaks");

interface IProps extends React.ComponentClass<HTMLDivElement> {
    SettingsStore?: SettingsStore;
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
    markdown: style({
        $nest: {
            "& *": {
                maxWidth: "fit-content",
                minHeight: "fit-content",
            },
        },
    }),
};

@inject("SettingsStore")
@observer
export class SideColumn extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getSideNavContents();
    }

    public render() {
        const contents = this.props.SettingsStore!.sideNavContents;
        const scriptRegex = /<script>(.*?)<\/script>/gsi;
        return (
            <div className={styles.root}>
                {contents.map((content, index) => {
                    const script = scriptRegex.exec(content);
                    if (script) {
                        try {
                            (window as any).eval(script[1] || "");
                        } catch (e) {
                            console.error("script evaluate error:", e);
                        }
                    }
                    return (
                        <EmotionalCard>
                            <ReactMarkdown
                                key={index}
                                source={content}
                                className={`markdown-body ${styles.markdown}`}
                                plugins={[[breaks]]}
                                escapeHtml={false}
                            />
                        </EmotionalCard>
                    );
                })}
            </div>
        );
    }
}