import * as React from "react";
import {TitleBar} from "../../../common/components/TitleBar";

interface IProps extends React.ClassAttributes<{}> {
}

interface IState extends React.ComponentState {
}

export class Index extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public render() {
        return (
            <div>
                <TitleBar>ホーム</TitleBar>
                <div>
                    // TODO: ここに何かエモい感じのダッシュボード
                </div>

                <div>
                    // FIXME: <a href="/">サイトに戻る</a>
                </div>
            </div>
        );
    }
}