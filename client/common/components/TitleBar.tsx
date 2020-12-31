import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

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