import React from "react";
import {style} from "typestyle";
import {COLORS, SIZES} from "../constants/Style";
import Paper from "@material-ui/core/Paper";
import type {PaperProps} from "@material-ui/core/Paper";
import {Link} from "react-router-dom";

interface IProps extends PaperProps {
    title: string;
}

const styles = {
    root: style({
        paddingTop: SIZES.Emotional.wrapHeight / 2,
        paddingBottom: SIZES.Emotional.wrapHeight,
        background: `${COLORS.EmotionalLightGray} !important`,
    }),
    inner: style({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        color: COLORS.EmotionalWhite,
    }),
    title: style({
        color: COLORS.EmotionalWhite,
        textDecoration: "none",
    })
};

export class Header extends React.Component<IProps, {}> {
    public render() {
        const { title } = this.props;
        const nextProps: PaperProps = { ...this.props };
        nextProps.title = undefined;

        return (
            <Paper {...nextProps} className={styles.root} elevation={2} square={true} component={"header"}>
                <div id={"title_container"} className={styles.inner}>
                    <Link to={"/"} id={"title"} className={styles.title}><h1>{title}</h1></Link>
                </div>
            </Paper>
        )
    }
}