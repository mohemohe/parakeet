import * as React from "react";
import {Header} from "../components/Header";
import {EmotionalContainer} from "../components/EmotionalContainer";
import {Footer} from "../components/Footer";

export interface IProps {
    title: string;
}

export class Template extends React.Component<IProps, {}> {
    public render() {
        return (
            <>
                <Header {...this.props}/>
                <EmotionalContainer maxWidth={"lg"}>
                    {this.props.children}
                </EmotionalContainer>
                <Footer/>
            </>
        );
    }
}