import React from "react";
import CF from "codeflask";
import {classes, style} from "typestyle";
import Card from "@material-ui/core/Card";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";

export interface IProp {
    value: string;
    options?: CF.options;
    onUpdate: (code: string) => void;

    elevation?: number;
    autosize?: boolean;
}

const styles = {
    root: style({
        display: "flex",
        flex: 1,

        $nest: {
            "& .autosize textarea": {
                overflowY: "hidden !important" as "hidden",
            },
        },
    }),
    container: style({
        flex: 1,
        minHeight: 160,
        position: "relative",
        $nest: {
            "& .codeflask--has-line-numbers .codeflask__pre": {
                width: "auto !important",
            },
            "& .codeflask--has-line-numbers:before": {
                zIndex: "4 !important" as any as number,
            },
            "& .codeflask__lines": {
                zIndex: "5 !important" as any as number,
            }
        },
    }),
}

export class CodeFlask extends React.Component<IProp, {}>{
    constructor(props: IProp) {
        super(props);

        this.id = `codeflask-${new Date().getTime() + Math.random()}`;
    }

    private id: string;
    private codeflask?: CF;

    public componentDidMount() {
        const target = document.getElementById(this.id);
        if (target) {
            const options = this.props.options || {};
            this.codeflask = new CF(target, options);
            if (options.language) {
                try {
                    // @ts-ignore
                    console.log(Prism.languages); this.codeflask.addLanguage(options.language, Prism.languages[options.language]);
                } catch (e) {
                    console.log(e);
                }
            }

            this.codeflask.updateCode(this.props.value);
            this.codeflask.onUpdate((code) => {
                this.updateHeight();
                this.props.onUpdate(code);
            });

            if (this.props.autosize) {
                this.updateHeight();
            }
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProp>, nextContext: any) {
        if (this.codeflask && nextProps.value !== this.codeflask.getCode()) {
            this.codeflask?.updateCode(nextProps.value);

            const target = document.getElementById(this.id);
            if (target && this.props.autosize) {
                this.updateHeight();
            }
        }
    }

    private updateHeight() {
        if (!this.props.autosize) {
            return;
        }

        const target = document.getElementById(this.id);
        if (!target) {
            return;
        }
        const pre = target.querySelector("pre");
        if (!pre) {
            return
        }
        const height = pre.clientHeight;
        target.style.height = `${height + 20}px`;
    }

    public render() {
        return (
            <Card elevation={this.props.elevation} className={styles.root}>
                <div id={this.id} className={classes(styles.container, this.props.autosize ? "autosize" : "")} />
            </Card>
        );
    }
}