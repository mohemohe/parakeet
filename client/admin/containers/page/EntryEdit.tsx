import * as React from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {inject, observer} from "mobx-react";
import {EntryStore, IEntry} from "../../stores/EntryStore";
import {RouteComponentProps} from "react-router";
import {style} from "typestyle";
import {Box, Fab, FormControl, FormControlLabel, Switch} from "@material-ui/core";
import Save from "@material-ui/icons/Save";
import {ValidatableTextField} from "../../components/ValidatableTextField";
import {TitleBar} from "../../../common/components/TitleBar";
import {Container} from "../../../common/components/Container";

interface IProps extends RouteComponentProps<{id: string}> {
    EntryStore?: EntryStore;
}

interface IState extends React.ComponentState {
}

const styles = {
    control: style({
        display: "block",
    }),
    simpleMDE: style({
        display: "flex",
        flexDirection: "column",
        width: "100%",

        $nest: {
            "& .fullscreen": {
                zIndex: 1100,
            },
            "& .CodeMirror": {
                height: "300px !important",
                flex: 1,
            },
            "& .editor-statusbar": {
                marginRight: 64,
            },
            "& .CodeMirror-fullscreen": {
                height: "auto !important",
                zIndex: 1100,
            },
            "& .CodeMirror-fullscreen + .editor-preview": {
                zIndex: 1100,
            },
        },
    }),
    saveButton: style({
        position: "fixed",
        zIndex: 9999,
        bottom: "1rem",
        right: "1rem",
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
        const {entry} = this.props.EntryStore!;
        const {_id, body, title, draft} = entry;
        let pageTitle = "エントリー";
        if (_id) {
            pageTitle += "編集";
        } else {
            pageTitle += "作成";
        }

        const insertReadMore = {
            name: "ReadMore",
            action: (editor: any) => {
                const moreText = "\n" + "<!-- more -->" + "\n";

                const codemirror = editor.codemirror;

                // REF: https://stackoverflow.com/a/42675408
                const selection = codemirror.getSelection();
                if (selection.length > 0) {
                    codemirror.replaceSelection("\n" + moreText + "\n");
                    return;
                }
                const doc = codemirror.getDoc();
                const cursor = doc.getCursor();
                doc.replaceRange(moreText, cursor);
            },
            className: "fa fa-minus-square",
            title: "Insert 'Read More'",
        };

        return (
            <>
                <TitleBar>{pageTitle}</TitleBar>
                <Container>
                    <Box>
                        <FormControl className={styles.control}>
                            <ValidatableTextField
                                label={"タイトル"}
                                fullWidth={true}
                                validators={[]}
                                onChangeValue={(event) => this.props.EntryStore!.setEntry({...entry, title: event.target.value})}
                                value={title}
                                InputLabelProps={{shrink: true}}
                            />
                        </FormControl>
                    </Box>

                    <Box>
                        <FormControlLabel
                            className={styles.control}
                            control={
                                <Switch
                                    checked={draft}
                                    onChange={(event) => this.props.EntryStore!.setEntry({...entry, draft: event.target.checked})}
                                    color="primary"
                                />
                            }
                            label="下書き"
                        />
                    </Box>

                    <Box display={"flex"} flex={1} width={"100%"}>
                        <SimpleMDE
                            className={styles.simpleMDE}
                            onChange={(body) => this.props.EntryStore!.setEntry({...entry, body})}
                            value={body}
                            options={{
                                spellChecker: false,
                                previewClass: ["editor-preview", "markdown-body"],
                                toolbar: [
                                    "bold", "italic", "strikethrough", "|",
                                    "heading-smaller", "heading-bigger", "|",
                                    "code", "quote", "unordered-list", "ordered-list", "table", "|",
                                    "link", "image", insertReadMore, "|",
                                    "preview", "side-by-side", "fullscreen", "|",
                                    "guide",
                                ],
                            }}/>
                    </Box>

                    <Fab className={styles.saveButton} color={"primary"} onClick={() => this.props.EntryStore!.putEntry()}>
                        <Save/>
                    </Fab>
                </Container>
            </>
        );
    }
}