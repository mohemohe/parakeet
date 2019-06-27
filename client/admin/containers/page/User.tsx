import * as React from "react";
import {inject} from "mobx-react";
import {UserStore} from "../../stores/UserStore";

interface IProps extends React.ClassAttributes<{}> {
    UserStore?: UserStore;
}

interface IState extends React.ComponentState {
}

@inject("UserStore")
export class User extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.UserStore!.getUsers(0);
    }

    public render() {
        return (
            <div>
                <h2>ユーザー</h2>

            </div>
        );
    }
}