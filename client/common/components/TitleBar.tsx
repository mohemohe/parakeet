import * as React from "react";
import {AppBar, Toolbar, Typography} from "@material-ui/core";

interface IProps {
}

export class TitleBar extends React.Component<IProps, {}> {
    public render() {
        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        {this.props.children}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}