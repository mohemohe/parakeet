import * as React from "react";
import {Header} from "../components/Header";
import {EmotionalContainer} from "../components/EmotionalContainer";
import {Footer} from "../components/Footer";


export class Template extends React.Component<{}, {}> {
    public render() {
        return (
            <>
                <Header/>
                <EmotionalContainer maxWidth={"lg"}>
                    {this.props.children}
                </EmotionalContainer>
                <Footer/>
            </>
        );
    }
}