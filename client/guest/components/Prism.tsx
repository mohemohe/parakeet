import React from "react";
import {style} from "typestyle";
import Renderer, {defaultProps} from "prism-react-renderer";
import type {Language} from "prism-react-renderer";
import oceanicNext from "prism-react-renderer/themes/oceanicNext";

interface IProps {
    language: Language;
    value: string;
}

const styles = {
    pre: style({
        textAlign: "left",
        margin: "1em 0",
        padding: "0.5em",
        $nest: {
            "& .token-line": {
                lineHeight: "1.3em",
                height: "1.3em",
            },
        },
    }),
    lineNo: style({
        display: "inline-block",
        width: "2em",
        userSelect: "none",
        opacity: 0.3,
    }),
};

export class Prism extends React.Component<IProps, {}> {
    public render() {
        return (
            <Renderer {...defaultProps} language={this.props.language} theme={oceanicNext} code={this.props.value}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={[className, styles.pre].join(" ")} style={style}>
                        {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                                <span className={styles.lineNo}>{i + 1}</span>
                                {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
                            </div>
                        ))}
                    </pre>
                )}
            </Renderer>
        );
    }
}