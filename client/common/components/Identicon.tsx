import React from "react";
import {style} from "typestyle";
import * as jdenticon from "jdenticon";

export interface IProps extends React.HTMLProps<HTMLDivElement> {
    source: string;
}

const styles = {
    root: style({
        $nest: {
            "&>svg": {
                width: "100%",
                height: "100%",
            },
        }
    }),
};

export class Identicon extends React.Component<IProps, {}> {
    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.source != nextProps.source;
    }

    public render(): React.ReactNode {
        return <div {...this.props} className={styles.root} dangerouslySetInnerHTML={{__html: (jdenticon as any).toSvg(this.props.source, 1024)}} />;
    }
}