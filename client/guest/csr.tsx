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

ReactDOM.hydrate(<App isSSR={false} pathname={(window as any).__INITIAL_STATE__.pathname} ssrState={(window as any).__INITIAL_STATE__.state}/>, document.querySelector("#app"));
