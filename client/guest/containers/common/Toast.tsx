import * as React from "react";
import { inject, observer } from "mobx-react";
import { Snackbar } from "@material-ui/core";
import ToastStore from "../../stores/ToastStore";
import { style } from "typestyle";

interface IProps {
    ToastStore?: ToastStore;
}

interface IState {
}

const styles = {
    root: style({
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 200,
        $nest: {
            "& > div": {
                display: "block !important" as "block",
                position: "relative !important" as "relative",
                marginTop: 8,
            }
        }
    }),
}

@inject("ToastStore")
@observer
export default class Toast extends React.Component<IProps, IState> {
    public render() {
        return (
            <div className={styles.root}>
                {
                    this.props.ToastStore!.toasts.map((toast) => (
                        <Snackbar
                            key={toast.uid}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            open={toast.open}
                            autoHideDuration={5000}
                            onClick={() => this.props.ToastStore!.closeToast(toast.uid)}
                            message={<span>{toast.message}</span>}
                        />
                    ))
                }
            </div>
        );
    }
}