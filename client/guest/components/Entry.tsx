import * as React from "react";
import {style} from "typestyle";
import {IEntry} from "../stores/EntryStore";
import {COLORS} from "../constants/Style";
import Card, {CardProps} from "@material-ui/core/Card";
import ReactMarkdown from "react-markdown";
import {Link} from "react-router-dom";

const breaks = require("remark-breaks");

interface IProps extends CardProps {
    entry: IEntry
}

const styles = {
    root: style({
        margin: "3rem 0",
        borderRadius: "8px 8px 4px 4px !important",
        overflow: "visible !important",
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
    }),
};

export class Entry extends React.Component<IProps, {}> {
    public render() {
        const { entry } = this.props;
        const created = new Date(entry._created);
        const modified = new Date(entry._modified);

        return (
            <Card {...this.props} className={styles.root} elevation={6}>
                <div className={styles.title}>
                    <h2 className={styles.link}>
                        <Link to={`/entry/${entry._id}`}>{entry.title}</Link>
                    </h2>
                    <div className={styles.subheader}>
                        <div>公開: {created.toLocaleString()},</div>
                        <div>更新: {modified.toLocaleString()}</div>
                    </div>
                </div>
                <ReactMarkdown source={entry.body} className={`markdown-body ${styles.body}`} plugins={[[breaks]]} escapeHtml={false}/>
            </Card>
        )
    }
}