import "core-js/stable";
import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";
import {setStylesTarget} from "typestyle";
import App from "./containers/App";

const style = document.getElementById("typestyle");
if (style) {
    setStylesTarget(style);
}

let initialState = (window as any).__INITIAL_STATE__;
if (!initialState) {
    initialState = {
        pathname: location.pathname,
        state: {
            entryStore: {
                entries: "[]",
                entry: "{}",
                paginate: "{}",
            },
        },
        title: document.title,
    };
    (window as any).__INITIAL_STATE__ = initialState;

    ReactDOM.render(<App isSSR={false} pathname={initialState.pathname} ssrState={initialState.state} title={initialState.title} />, document.querySelector("#app"));
} else {
    ReactDOM.hydrate(<App isSSR={false} pathname={initialState.pathname} ssrState={initialState.state} title={initialState.title} />, document.querySelector("#app"));
}
