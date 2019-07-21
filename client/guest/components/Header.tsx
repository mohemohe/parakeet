import * as React from "react";
import {style} from "typestyle";
import {COLORS, SIZES} from "../constants/Style";
import Paper, {PaperProps} from "@material-ui/core/Paper";
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
        return (
            <Paper {...this.props} className={styles.root} elevation={2} square={true}>
                <div className={styles.inner}>
                    <Link to={"/"} className={styles.title}><h1>{this.props.title}</h1></Link>
                </div>
            </Paper>
        )
    }
}