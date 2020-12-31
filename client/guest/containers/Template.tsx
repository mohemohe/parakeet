import React from "react";
import {inject, observer} from "mobx-react";
import {Header} from "../components/Header";
import {EmotionalContainer} from "../components/EmotionalContainer";
import {Footer} from "../components/Footer";
import {style} from "typestyle";
import {SIZES} from "../constants/Style";
import {SideColumn} from "./common/SideColumn";
import type {SettingsStore} from "../stores/SettingsStore";
import {Search} from "./common/Search";

export interface IProps {
    title: string;
    SettingsStore?: SettingsStore;
    showSearch: boolean;
}

const styles = {
    root: style({
        marginTop: `-${SIZES.Emotional.wrapHeight}px !important`,
        marginBottom: `-${SIZES.Emotional.wrapHeight}px !important`,
        zIndex: 1,
        flex: 1,
    }),
    columns: style({
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    }),
    main: style({
        width: "100%",
        maxWidth: 920,
        margin: "0 0.5rem 1rem 0.5rem",
    }),
    side: style({
        flex: 1,
        margin: "0 0.5rem",
        maxWidth: 920,
        minWidth: 260,
    }),
};

@inject("SettingsStore")
@observer
export class Template extends React.Component<IProps, {}> {
    public componentDidMount() {
        this.props.SettingsStore!.getSideNavContents();
        this.props.SettingsStore!.getMongoDbSearch();
    }

    public render() {
        return (
            <>
                <Header title={this.props.title}/>
                <EmotionalContainer maxWidth={"lg"} component={"main"}>
                    <div id={"column_container"} className={styles.columns}>
                        <div id={"main_column"} className={styles.main}>
                            {this.props.children}
                        </div>
                        {
                            this.props.SettingsStore!.sideNavContents.filter((content) => content.length !== 0).length !== 0 ?
                                <div id={"side_column"} className={styles.side}>
                                    <SideColumn/>
                                </div> :
                                undefined
                        }
                    </div>
                </EmotionalContainer>
                <Footer/>
                {this.props.showSearch && this.props.SettingsStore!.mongoDbSearch === "regex" && <Search />}
            </>
        );
    }
}