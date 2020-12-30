import * as React from "react";
import {inject, observer} from "mobx-react";
import {SettingsStore} from "../../../stores/SettingsStore";
import {RouteComponentProps} from "react-router-dom";
import {ValidatableTextField} from "../../../components/ValidatableTextField";
import {FormControl, Button, Fab, Box, Typography} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {style} from "typestyle";
import {AuthStore} from "../../../stores/AuthStore";
import {TitleBar} from "../../../../common/components/TitleBar";
import {Container} from "../../../../common/components/Container";
import {CodeFlask} from "../../../components/CodeFlask";

interface IProps extends RouteComponentProps<{id: string}> {
    AuthStore?: AuthStore;
    SettingsStore?: SettingsStore;
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
    sidebarTextField: style({
        flex: 1,
    }),
};

@inject("AuthStore", "SettingsStore")
@observer
export class SiteSetting extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        this.props.SettingsStore!.getSiteTitle();
        this.props.SettingsStore!.getSideNavContents();
    }

    public render() {
        const { siteTitle, sideNavContents } = this.props.SettingsStore!;

        return (
            <>
                <TitleBar>サイト情報</TitleBar>
                <Container>
                    <FormControl className={styles.control}>
                        <ValidatableTextField
                            label={"タイトル"}
                            fullWidth={true}
                            validators={[]}
                            value={siteTitle}
                            InputLabelProps={{shrink: true}}
                            onChangeValue={(event) => this.props.SettingsStore!.setSiteTitle(event.target.value)}/>
                        {
                            sideNavContents.map((sideNavContent, index) => {
                                return (
                                    <Box key={index}>
                                        <Typography variant="caption" gutterBottom>
                                            サイドバー {index + 1}
                                        </Typography>
                                        <Box display={"flex"} alignItems={"stretch"} marginBottom={2}>
                                            <CodeFlask
                                                elevation={2}
                                                autosize={true}
                                                value={sideNavContents[index]}
                                                options={{
                                                    language: "markdown",
                                                    lineNumbers: true,
                                                    handleTabs: true,
                                                    tabSize: 2,
                                                }}
                                                onUpdate={(value) => {
                                                    const contents = [...sideNavContents];
                                                    contents[index] = value;
                                                    this.props.SettingsStore!.setSideNavContents(contents);
                                                }}
                                            />
                                            <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} marginLeft={2} marginY={1}>
                                                <Fab size="small" aria-label="up" disabled={index === 0} onClick={() => {
                                                    const contents = [...sideNavContents];
                                                    [contents[index-1], contents[index]] = [contents[index], contents[index-1]];
                                                    this.props.SettingsStore!.setSideNavContents(contents);
                                                }}>
                                                    <ArrowUpwardIcon />
                                                </Fab>
                                                <Fab color="secondary" size="small" aria-label="remove" disabled={index === 0 && sideNavContents.length === 1} onClick={() => {
                                                    const contents = [...sideNavContents];
                                                    contents.splice(index, 1);
                                                    this.props.SettingsStore!.setSideNavContents(contents);
                                                }}>
                                                    <RemoveIcon />
                                                </Fab>
                                                <Fab size="small" aria-label="down" disabled={index === sideNavContents.length-1} onClick={() => {
                                                    const contents = [...sideNavContents];
                                                    [contents[index], contents[index+1]] = [contents[index+1], contents[index]];
                                                    this.props.SettingsStore!.setSideNavContents(contents);
                                                }}>
                                                    <ArrowDownwardIcon />
                                                </Fab>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                        <Box display={"flex"} justifyContent={"center"}>
                            <Fab color="primary" size="small" aria-label="add" onClick={() => {
                                const contents = [...sideNavContents];
                                contents.push("");
                                this.props.SettingsStore!.setSideNavContents(contents);
                            }}>
                                <AddIcon />
                            </Fab>
                        </Box>
                    </FormControl>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button className={styles.button} variant={"contained"} color={"primary"} onClick={() => {
                            this.props.SettingsStore!.putSiteTitle();
                            this.props.SettingsStore!.putSideNavContents();
                        }}>保存</Button>
                    </Box>
                </Container>
            </>
        );
    }
}
