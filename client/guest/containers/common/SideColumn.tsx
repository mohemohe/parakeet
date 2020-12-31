import React from "react";
import {inject, observer} from "mobx-react";
import type {SettingsStore} from "../../stores/SettingsStore";
import {style} from "typestyle";
import {EmotionalCard} from "../../components/EmotionalCard";
import ReactMarkdown from "react-markdown";
import {COLORS, DARK_COLORS} from "../../constants/Style";

const breaks = require("remark-breaks");

interface IProps extends React.ComponentClass<HTMLDivElement> {
    SettingsStore?: SettingsStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    root: style({
        $nest: {
            "& section": {
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
            ["@media (prefers-color-scheme: dark)"]: {
                background: `${DARK_COLORS.PaperBackGround} !important`,
                color: `${COLORS.EmotionalWhite} !important`,

                $nest: {
                    "& a": {
                        color: "#68a8f1 !important",
                    },
                    "& blockquote": {
                        color: "#8d98a5 !important",
                    },
                    "& code": {
                        color: "#a8ff60 !important",
                        background: "#393e48 !important",
                    },
                    "& pre": {
                        background: "#393e48 !important",
                    },
                },
            },
            "& *": {
                maxWidth: "fit-content",
                minHeight: "fit-content",
            },
            "& img": {
                maxWidth: "100%",
                minHeight: "unset",
                height: "auto",
            },
            "& h1": {
                maxWidth: "100%",
            },
            "& h2": {
                maxWidth: "100%",
            },
            "& h3": {
                maxWidth: "100%",
            },
            "& h4": {
                maxWidth: "100%",
            },
            "& h5": {
                maxWidth: "100%",
            },
            "& h6": {
                maxWidth: "100%",
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
        return (
            <div id={"side_container"} className={styles.root}>
                {contents.map((content, index) => {
                    const scriptRegex = /<script>(.*?)<\/script>/gsi;
                    const script = scriptRegex.exec(content);
                    console.log("script:", content, script);
                    if (script) {
                        try {
                            (window as any).eval(script[1] || "");
                        } catch (e) {
                            console.error("script evaluate error:", e);
                        }
                    }
                    return (
                        <EmotionalCard id={`side_content-${index+1}`} component={"section"}>
                            <ReactMarkdown
                                key={index}
                                source={content}
                                className={`side_content_body markdown-body ${styles.markdown}`}
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