import "core-js/stable";
import "whatwg-fetch";
import * as React from "react";
import ReactDOM from "react-dom";
import * as typestyle from "typestyle";
import App from "./containers/App";

const style = document.getElementById("typestyle");
if (style) {
    typestyle.setStylesTarget(style);
}

const initialState = (window as any).__INITIAL_STATE__;

ReactDOM.hydrate(<App isSSR={false} pathname={initialState.pathname} ssrState={initialState.state} title={initialState.title} />, document.querySelector("#app"));
