import * as React from "react";
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import {style} from "typestyle";

interface IProps {
}

const styles = {
    padding: style({
        minHeight: 64,
        width: "100%",
    }),
    appBar: style({
        zIndex: 100,
    }),
    toolBar: style({
        marginLeft: 320,
    }),
};

export class TitleBar extends React.Component<IProps, {}> {
    public render() {
        return (
            <div className={styles.padding}>
                <AppBar position="fixed" color="primary" className={styles.appBar}>
                    <Toolbar className={styles.toolBar}>
                        <Typography variant="h6" color="inherit">
                            {this.props.children}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}