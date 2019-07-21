import "core-js/stable";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {getStyles} from "typestyle";
import App from "./containers/App";
import { ServerStyleSheets } from "@material-ui/styles";
import {ISSRState} from "./stores";

interface ISSROptions {
    url: string;
    headers: any;
    state: ISSRState;
}

function SSR(options: ISSROptions, callback: (result: any) => void) {
    console.log("SSR from js");

    console.log("initial state:", options.state);
    console.log("initial state:", options.state.entryStore);
    console.log("initial state:", JSON.stringify(options.state));

    const serverStyleSheets = new ServerStyleSheets();
    const app = ReactDOMServer.renderToString(
        serverStyleSheets.collect(
            <App isSSR={true} pathname={options.url} ssrState={options.state}/>
        ));

    const materialStyle = serverStyleSheets.toString().replace(/\n/g,"").replace(/\s*([{};:,])\s+/g, "$1");
    const customStyle = getStyles();
    const style = materialStyle + customStyle;

    console.log("materialStyle:", materialStyle);
    console.log("customStyle:", customStyle);

    console.log("SSR complete");

    callback({
        app,
        style,
        title: undefined || "parakeet",
        meta: undefined,
        state: JSON.stringify({
            pathname: options.url,
        }),
        error: undefined || "",
    });
}

(global as any).SSR = SSR;