import React from "react";
import {style} from "typestyle";
import Card from "@material-ui/core/Card";
import type { CardProps } from "@material-ui/core/Card";
import {COLORS, DARK_COLORS} from "../constants/Style";

interface IProps extends CardProps {
}

const styles = {
    root: style({
        padding: "1rem",
        $nest: {
            ["@media (prefers-color-scheme: dark)"]: {
                background: `${DARK_COLORS.PaperBackGround} !important`,
                color: `${COLORS.EmotionalWhite} !important`,
            },
        },
    }),
};

export class EmotionalCard extends React.Component<IProps, {}> {
    public render() {
        return (
            <Card {...this.props} className={styles.root} elevation={6}>
                {this.props.children}
            </Card>
        )
    }
}