import * as React from "react";
import { inject, observer } from "mobx-react";
import { Snackbar } from "@material-ui/core";
import ToastStore from "../../stores/ToastStore";

interface IProps {
    ToastStore?: ToastStore;
}

interface IState {
}

@inject("ToastStore")
@observer
export default class Toast extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.handleClose = this.handleClose.bind(this);
    }

    private handleClose() {
        this.props.ToastStore!.open = false;
    }

    public render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={this.props.ToastStore!.open}
                autoHideDuration={5000}
                onClose={this.handleClose}
                message={<span>{this.props.ToastStore!.message}</span>}
            />
        );
    }
}