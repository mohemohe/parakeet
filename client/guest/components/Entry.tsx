import * as React from "react";
import {style} from "typestyle";
import {IEntry} from "../stores/EntryStore";
import {COLORS, DARK_COLORS} from "../constants/Style";
import Card, {CardProps} from "@material-ui/core/Card";
import ReactMarkdown from "react-markdown";
import {Link} from "react-router-dom";
import {LinkButton} from "../../common/components/LinkButton";
import {Prism} from "./Prism";
import {Plain} from "./Plain";

const breaks = require("remark-breaks");

interface IProps extends CardProps {
    entry: IEntry
    stopToReadMore: boolean;
    syntaxHighlighting: boolean;
}

const styles = {
    root: style({
        margin: "3rem 0",
        borderRadius: "8px 8px 4px 4px !important",
        overflow: "visible !important",
        $nest: {
            ["@media (prefers-color-scheme: dark)"]: {
                background: `${DARK_COLORS.PaperBackGround} !important`,
                color: `${COLORS.EmotionalWhite} !important`,
            },
        },
    }),
    title: style({
        background: COLORS.BaseColor,
        color: `${COLORS.EmotionalWhite} !important`,
        borderRadius: "4px 4px 0 0",
        padding: "1rem",
        $nest: {
            "& a": {
                color: `${COLORS.EmotionalWhite} !important`,
            },
            "& .MuiTypography-colorTextSecondary": {
                color: `${COLORS.EmotionalWhite} !important`,
                opacity: 0.54,
            },
        },
    }),
    link: style({

    }),
    subheader: style({
        display: "flex",
        flexWrap: "wrap",
        opacity: 0.56,
        $nest: {
            "& > *": {
                marginRight: "1em",
            },
        },
    }),
    body: style({
        padding: "1rem",
        $nest: {
            ["@media (prefers-color-scheme: dark)"]: {
                background: `${DARK_COLORS.PaperBackGround} !important`,
                color: `${COLORS.EmotionalWhite} !important`,
            },
        },
    }),
    readMore: style({
        display: "flex",
        justifyContent: "flex-end",
        padding: "1rem",
    }),
};

const more = "<!-- more -->";

export class Entry extends React.Component<IProps, {}> {
    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (!this.props.stopToReadMore && this.props.syntaxHighlighting && window.location.search.includes("scroll=more")) {
            document.querySelector("#entry_more")?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    public render() {
        const { entry } = this.props;
        const created = new Date(entry._created);
        let modified: Date | undefined;
        if (entry._modified !== "") {
            modified = new Date(entry._modified);
        }

        let body = entry.body;
        let showReadMore = false;
        if (this.props.stopToReadMore && body.includes(more)) {
            body = body.split(more).shift() || body;
            showReadMore = true;
        } else {
            body = body.replace(more, `<div id="entry_more"></div>`);
        }

        let renderers;
        if (this.props.syntaxHighlighting) {
            renderers = {code: Prism};
        } else {
            renderers = {code: Plain};
        }

        return (
            <Card {...this.props} className={styles.root} elevation={6}>
                <div className={styles.title}>
                    <h2 className={styles.link}>
                        <Link to={`/entry/${entry._id}`}>{entry.title}</Link>
                    </h2>
                    <div className={styles.subheader}>
                        <div>
                            公開: {created.toLocaleString()}
                            {modified ? "," : ""}
                        </div>
                        {modified ? <div>更新: {modified.toLocaleString()}</div> : <></>}
                    </div>
                </div>
                <ReactMarkdown
                    source={body}
                    className={`markdown-body ${styles.body}`}
                    plugins={[[breaks]]}
                    escapeHtml={false}
                    renderers={renderers}

                />
                {showReadMore ?
                    <div className={styles.readMore}>
                        <LinkButton to={`/entry/${entry._id}?scroll=more`} buttonProps={{variant: "contained", color: "primary"}}>続きを読む</LinkButton>
                    </div> :
                    undefined
                }
            </Card>
        )
    }
}