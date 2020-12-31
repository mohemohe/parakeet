import "core-js/stable";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {getStyles} from "typestyle";
import App from "./containers/App";
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import {ISSRState} from "./stores";

interface ISSROptions {
    url: string;
    title: string;
    headers: any;
    state: ISSRState;
}

function SSR(options: ISSROptions, callback: (result: any) => void) {
    const start = Date.now();
    console.log("SSR start");

    const serverStyleSheets = new ServerStyleSheets();
    const app = ReactDOMServer.renderToString(
        serverStyleSheets.collect(
            <App isSSR={true} pathname={options.url} ssrState={options.state} title={options.title}/>
        ));

    const materialStyle = serverStyleSheets.toString().replace(/\n/g,"").replace(/\s*([{};:,])\s+/g, "$1");
    const customStyle = getStyles();
    const style = materialStyle + customStyle ;

    console.log("SSR complete, elapsed:", Date.now() - start, "ms");

    callback({
        app,
        style,
        title: options.title,
        meta: undefined,
        state: JSON.stringify({
            pathname: options.url,
            state: options.state,
            title: options.title,
        }),
        error: undefined || "",
    });
}

(global as any).SSR = SSR;