import * as React from "react";
import {inject, observer} from "mobx-react";
import {Header} from "../components/Header";
import {EmotionalContainer} from "../components/EmotionalContainer";
import {Footer} from "../components/Footer";
import {style} from "typestyle";
import {SIZES} from "../constants/Style";
import {SideColumn} from "./common/SideColumn";
import {SettingsStore} from '../stores/SettingsStore';

export interface IProps {
    title: string;
    SettingsStore?: SettingsStore;
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
        flexGrow: 9999,
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
    }

    public render() {
        return (
            <>
                <Header title={this.props.title}/>
                <EmotionalContainer maxWidth={"lg"}>
                    <div className={styles.columns}>
                        <div className={styles.main}>
                            {this.props.children}
                        </div>
                        {
                            this.props.SettingsStore!.sideNavContents.filter((content) => content.length !== 0).length !== 0 ?
                                <div className={styles.side}>
                                    <SideColumn/>
                                </div> :
                                undefined
                        }
                    </div>
                </EmotionalContainer>
                <Footer/>
            </>
        );
    }
}