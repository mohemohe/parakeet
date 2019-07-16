import * as React from "react";
import {Link, LinkProps} from "react-router-dom";
import {Button} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import {style} from "typestyle";

interface IProps extends LinkProps {
    buttonProps?: ButtonProps
}

const styles = {
    button: style({
        textDecoration: "none",
    }),
};

export class LinkButton extends React.Component<IProps, {}> {
    public render() {
        if (this.props.buttonProps) {
            return (
                <Link {...this.props}>
                    <Button {...this.props.buttonProps} className={`${this.props.buttonProps.className} ${styles.button}`}>{this.props.children}</Button>
                </Link>
            );
        } else {
            return (
                <Link {...this.props}>
                    <Button className={styles.button}>{this.props.children}</Button>
                </Link>
            );
        }
    }
}