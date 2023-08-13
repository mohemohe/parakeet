import React from "react";
import {classes, style} from "typestyle";
import type {IEntry} from "../stores/EntryStore";
import {COLORS, DARK_COLORS} from "../constants/Style";
import Card from "@material-ui/core/Card";
import type {CardProps} from "@material-ui/core/Card";
import {Link} from "react-router-dom";
import {LinkButton} from "../../common/components/LinkButton";
import {UnsafeMarkdown} from "./UnsafeMarkdown";

interface IProps extends CardProps {
    entry: IEntry
    stopToReadMore: boolean;
    syntaxHighlighting: boolean;
    isSSR: boolean;
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

                $nest: {
                    "& a": {
                        color: "#68a8f1 !important",
                    },
                    "& blockquote": {
                        color: "#8d98a5 !important",
                    },
                    "& code": {
                        color: "#a8ff60",
                        background: "#393e48 !important",
                    },
                    "& pre": {
                        background: "#393e48 !important",
                    },
                },
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

        let created: string | undefined;
        if (this.props.isSSR) {
            created = entry._created;
        } else {
            created = new Date(entry._created).toLocaleString();
        }

        let modified: string | undefined;
        if (entry._modified && entry._modified !== "") {
            if (this.props.isSSR) {
                modified = entry._modified;
            } else {
                modified = new Date(entry._modified).toLocaleString();
            }
        }

        let body = entry.body || "";
        let showReadMore = false;
        if (this.props.stopToReadMore && body.includes(more)) {
            body = body.split(more).shift() || body;
            showReadMore = true;
        } else {
            body = body.replace(more, `<div id="entry_more"></div>`);
        }

        const nextProps = { ...this.props };
        delete nextProps.entry;
        delete nextProps.stopToReadMore;
        delete nextProps.syntaxHighlighting;

        return (
            <Card {...nextProps} className={classes("entry", styles.root)} elevation={6} component={"article"}>
                <div className={classes("entry_header", styles.title)}>
                    <h2 className={classes("entry_title", styles.link)}>
                        <Link to={`/entry/${entry._id}`}>{entry.title}</Link>
                    </h2>
                    <div className={classes("entry_datetime", styles.subheader)}>
                        <div className={"entry_created"}>
                            公開: {created}
                            {modified ? "," : ""}
                        </div>
                        {modified ? <div className={"entry_updated"}>更新: {modified}</div> : <></>}
                    </div>
                </div>
                <UnsafeMarkdown content={body} markdownClassName={styles.body} syntaxHighlighting={this.props.syntaxHighlighting} />
                {showReadMore ?
                    <div className={classes("entry_readmore", styles.readMore)}>
                        <LinkButton className={"entry_readmore_button"} to={`/entry/${entry._id}?scroll=more`} buttonProps={{variant: "contained", color: "primary"}}>続きを読む</LinkButton>
                    </div> :
                    undefined
                }
            </Card>
        )
    }
}
