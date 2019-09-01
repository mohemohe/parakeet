import * as React from "react";
import {style} from "typestyle";
import Card, {CardProps} from "@material-ui/core/Card";

interface IProps extends CardProps {
}

const styles = {
    root: style({
        padding: "1rem",
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