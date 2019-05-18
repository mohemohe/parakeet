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

ReactDOM.render(<App isSSR={false} pathname={(window as any).__INITIAL_STATE__.pathname}/>, document.querySelector("#app"));
