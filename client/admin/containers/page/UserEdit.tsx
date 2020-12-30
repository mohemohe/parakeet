import * as React from "react";
import {inject, observer} from "mobx-react";
import {UserStore} from "../../stores/UserStore";
import {RouteComponentProps} from "react-router-dom";
import {ValidatableTextField} from "../../components/ValidatableTextField";
import {FormControl, Input, InputLabel, Select, MenuItem, Button, Box} from "@material-ui/core";
import {style} from "typestyle";
import {AuthStore} from "../../stores/AuthStore";
import {TitleBar} from "../../../common/components/TitleBar";
import {Container} from "../../../common/components/Container";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    UserStore?: UserStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    control: style({
        display: "block",
    }),
    button: style({
        marginTop: "1rem",
    }),
};

@inject("AuthStore", "UserStore")
@observer
export class UserEdit extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        const { id } = this.props.match.params;
        this.props.UserStore!.getUser(id);
    }

    private lock() {
        return this.props.AuthStore!.userInfo._id === this.props.UserStore!.user._id;
    }

    public render() {
        const user = this.props.UserStore!.user;

        return (
            <>
                <TitleBar>ユーザー編集</TitleBar>
                <Container>
                    <FormControl className={styles.control}>
                        <ValidatableTextField label={"ID"} fullWidth={true} validators={[]} onChangeValue={() => {}} value={user._id} disabled={true} InputLabelProps={{shrink: true}}/>
                    </FormControl>
                    <FormControl className={styles.control}>
                        <ValidatableTextField label={"email"} fullWidth={true} validators={[]} onChangeValue={(event) => this.props.UserStore!.setUser({...user, email: event.target.value})} value={user.email} disabled={this.lock()} InputLabelProps={{shrink: true}}/>
                    </FormControl>
                    <FormControl className={styles.control}>
                        <ValidatableTextField label={"名前"} fullWidth={true} validators={[]} onChangeValue={(event) => this.props.UserStore!.setUser({...user, name: event.target.value})} value={user.name} InputLabelProps={{shrink: true}}/>
                    </FormControl>
                    <FormControl className={styles.control}>
                        <InputLabel htmlFor={"user_role"} shrink={true}>権限</InputLabel>
                        <Select
                            value={user.role}
                            onChange={(event) => this.props.UserStore!.setUser({...user, role: parseInt(event.target.value as string, 10)})}
                            disabled={this.lock()}
                            input={<Input id="user_role" />}
                        >
                            <MenuItem value={0}>
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>管理者</MenuItem>
                            <MenuItem value={2}>編集者</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => this.props.UserStore!.putUser()}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}