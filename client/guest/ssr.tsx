import "core-js/stable";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {getStyles} from "typestyle";
import App from "./containers/App";

function SSR(options: any, callback: (result: any) => void) {
    console.log("SSR from js");
    const app = ReactDOMServer.renderToString(<App isSSR={true} pathname={options.url}/>);
    const style = getStyles();
    console.log("SSR complete");

    callback({
        uuid: options.uuid,
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