import React from "react";

interface IProps {
    language: string;
    value: string;
}

export class Plain extends React.Component<IProps, {}> {
    public render() {
        return (
            <div>
                <pre className={"ssr"}>
                    {this.props.value}
                </pre>
            </div>
        );
    }
}