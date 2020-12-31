import React from "react";
import {style} from "typestyle";
import Container from "@material-ui/core/Container";
import type {ContainerProps} from "@material-ui/core/Container";
import {SIZES} from "../constants/Style";

interface IProps extends ContainerProps {
}

const styles = {
    root: style({
        marginTop: `-${SIZES.Emotional.wrapHeight}px !important`,
        marginBottom: `-${SIZES.Emotional.wrapHeight}px !important`,
        zIndex: 1,
        flex: 1,
    }),

};

export class EmotionalContainer extends React.Component<IProps, {}> {
    public render() {
        return (
            <Container {...this.props} className={styles.root}>
                {this.props.children}
            </Container>
        )
    }
}