import React from "react";
import {style} from "typestyle";

interface IProps {
}

const styles = {
    root: style({
        display: "flex",
        flex: 1,
        flexDirection: "column",
        padding: "1rem",
        overflow: "auto",
    }),
};

export class Container extends React.Component<IProps, {}> {
    public render() {
        return (
            <div className={styles.root}>
                {this.props.children}
            </div>
        );
    }
}