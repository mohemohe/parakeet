import * as React from "react";
import {style} from "typestyle";
import {IEntry} from "../stores/EntryStore";
import {COLORS} from "../constants/Style";
import Card, {CardProps} from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ReactMarkdown from "react-markdown";
import {Link} from "react-router-dom";

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
                <CardHeader className={styles.title} title={<Link to={`/entry/${entry._id}`}>{entry.title}</Link>} subheader={`公開: ${created.toLocaleString()}, 更新: ${modified.toLocaleString()}`}/>
                <ReactMarkdown source={entry.body} className={`markdown-body ${styles.body}`} escapeHtml={false}/>
            </Card>
        )
    }
}