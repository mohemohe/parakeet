import React from "react";
import {style} from "typestyle";
import {COLORS, SIZES} from "../constants/Style";
import Container from "@material-ui/core/Container";

interface IProps extends React.ComponentClass<HTMLDivElement> {
}

const styles = {
    root: style({
        paddingTop: SIZES.Emotional.wrapHeight,
        background: COLORS.EmotionalDarkGray,
    }),
    inner: style({
        minHeight: 200,
        paddingTop: "3rem",
        color: COLORS.EmotionalWhite,
        $nest: {
            "& a": {
                color: COLORS.EmotionalWhite,
            }
        },
    }),
};

export class Footer extends React.Component<IProps, {}> {
    public render() {
        return (
            <footer {...this.props} className={styles.root}>
                <Container maxWidth={"xl"} className={styles.inner}>
                    <p><a href="https://github.com/mohemohe/parakeet">GitHub</a></p>
                    <p><a href="/admin">管理画面</a></p>
                    <p><a href="/swagger">swagger</a></p>
                </Container>
            </footer>
        )
    }
}