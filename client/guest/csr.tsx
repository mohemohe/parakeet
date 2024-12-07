import "core-js/stable";
import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";
import {setStylesTarget} from "typestyle";
import App from "./containers/App";
import "./style.scss";
import { theme } from "../common/lib/theme";
import { createEmotionCache } from "../common/lib/emotion";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";

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

    const emotionCache = createEmotionCache();

    ReactDOM.render(
      <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App isSSR={false} pathname={initialState.pathname} ssrState={initialState.state} title={initialState.title} />
      </ThemeProvider>
    </CacheProvider>
    , document.querySelector("#app"));
} else {
    ReactDOM.hydrate(<App isSSR={false} pathname={initialState.pathname} ssrState={initialState.state} title={initialState.title} />, document.querySelector("#app"));
}
