import React from "react";
import {style} from "typestyle";
import {Identicon} from "../../common/components/Identicon";
import {Typography} from "@material-ui/core";
import {COLORS} from "../constants/Style";

export interface IProps extends React.HTMLProps<HTMLDivElement> {
    identicon: string;
    name: string;
    role: string;
}

const styles = {
    root: style({
        display: "flex",
        flexDirection: "row",
    }),
    names: style({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    }),
    role: style({
        color: COLORS.SuperExtraDarkGray,
    })
};

export class UserInfo extends React.Component<IProps, {}> {
    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.name != nextProps.name && this.props.role != nextProps.role;
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.root} {...this.props}>
                <Identicon source={this.props.identicon} style={{width: 64, height: 64}}/>
                <div className={styles.names}>
                    <Typography variant={"subtitle1"}>
                        {this.props.name}
                    </Typography>
                    <p className={styles.role}>
                        {this.props.role}
                    </p>
                </div>
                {this.props.children}
            </div>
        );
    }
}