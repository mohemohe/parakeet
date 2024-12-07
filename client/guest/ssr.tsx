import "core-js/stable";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { getStyles } from "typestyle";
import App from "./containers/App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { ISSRState } from "./stores";
import { theme } from "../common/lib/theme";
import { createEmotionCache } from "../common/lib/emotion";

interface ISSROptions {
  url: string;
  title: string;
  headers: any;
  state: ISSRState;
}

function SSR(options: ISSROptions, callback: (result: any) => void) {
  const start = Date.now();
  console.log("SSR start");

  const emotionCache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(emotionCache);

  const app = ReactDOMServer.renderToString(
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App isSSR={true} pathname={options.url} ssrState={options.state} title={options.title} />
      </ThemeProvider>
    </CacheProvider>,
  );

  // const materialStyle = serverStyleSheets.toString().replace(/\n/g,"").replace(/\s*([{};:,])\s+/g, "$1");
  const emotionChunks = extractCriticalToChunks(app);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);
  const customStyle = getStyles();
  const style = emotionCss + customStyle;

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

if (process.env.NODE_ENV !== 'production') {
  (global as any).$RefreshReg$ = () => { };
  (global as any).$RefreshSig$ = () => () => { };
}

(global as any).SSR = SSR;
