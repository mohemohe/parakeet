import * as React from "react";
import {inject, observer} from "mobx-react";
import {UserStore} from "../../stores/UserStore";
import {AutoTable} from "../../components/AutoTable";

interface IProps extends React.ClassAttributes<{}> {
    UserStore?: UserStore;
}

interface IState extends React.ComponentState {
}

@inject("UserStore")
@observer
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
                <AutoTable items={this.props.UserStore!.editableUsers} order={["_id", "email", "name", "role", "path"]} replacer={new Map<string, string>([["_id", "ID"], ["name", "名前"], ["role", "権限"], ["path", " "]])}/>
            </div>
        );
    }
}