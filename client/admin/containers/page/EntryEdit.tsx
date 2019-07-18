import * as React from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {inject, observer} from "mobx-react";
import {EntryStore, IEntry} from "../../../common/stores/EntryStore";
import {RouteComponentProps} from "react-router";
import {style} from "typestyle";
import {Button, FormControl} from "@material-ui/core";
import {ValidatableTextField} from "../../components/ValidatableTextField";

interface IProps extends RouteComponentProps<{id: string}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    control: style({
        display: "block",
    }),
};

@inject("EntryStore")
@observer
export class EntryEdit extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
    }

    public componentDidMount() {
        const { id } = this.props.match.params;
        if (id && id != "") {
            this.props.EntryStore!.getEntry(id);
        } else {
            const entry: IEntry = {
                title: "",
                tags: [],
                body: "",
            } as any;
            this.props.EntryStore!.setEntry(entry)
        }
    }

    public render() {
        const entry = this.props.EntryStore!.entry;

        let pageTitle = "エントリー";
        if (entry._id) {
            pageTitle += "編集";
        } else {
            pageTitle += "作成";
        }
        return (
            <div>
                <h2>{pageTitle}</h2>
                <FormControl className={styles.control}>
                    <ValidatableTextField
                        label={"タイトル"}
                        fullWidth={true}
                        validators={[]}
                        onChangeValue={(event) => this.props.EntryStore!.setEntry({...entry, title: event.target.value})}
                        value={entry.title}
                        InputLabelProps={{shrink: true}}
                    />
                </FormControl>
                <SimpleMDE onChange={(body) => this.props.EntryStore!.setEntry({...entry, body})} value={entry.body}/>
                <Button onClick={() => this.props.EntryStore!.putEntry()} variant={"raised"} color={"primary"}>保存</Button>
            </div>
        );
    }
}