import * as React from "react";
import {inject, observer} from "mobx-react";
import {UserStore} from "../../stores/UserStore";
import {AutoTable} from "../../components/AutoTable";
import {TitleBar} from "../../../common/components/TitleBar";
import {Container} from "../../../common/components/Container";

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

        this.index = 1;
    }

    private index: number;

    public componentDidMount() {
        this.props.UserStore!.getUsers(this.index);
    }

    public get back() {
        return this.index === 1 ? 1 : --this.index;
    }

    public get forward() {
        return ++this.index;
    }

    public render() {
        return (
            <>
                <TitleBar>ユーザー</TitleBar>
                <Container>
                    {/*<Box display={"flex"} justifyContent={"flex-end"} marginBottom={2}>*/}
                    {/*    <LinkButton to={"/users/new"} buttonProps={{variant: "contained", color: "primary"}}>作成</LinkButton>*/}
                    {/*</Box>*/}
                    <AutoTable
                        items={this.props.UserStore!.editableUsers}
                        order={["_id", "email", "name", "role", "path"]}
                        replacer={new Map<string, string>([["_id", "ID"], ["name", "名前"], ["role", "権限"], ["path", " "]])}
                        onClickBack={() => this.props.UserStore!.getUsers(this.back)}
                        onClickForward={() => this.props.UserStore!.getUsers(this.forward)}
                        disableBackButton={this.index === 1}
                        disableForwardButton={this.index === this.props.UserStore!.info.totalPages}
                    />
                </Container>
            </>
        );
    }
}