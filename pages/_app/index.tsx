// #region Global Imports
import React, { useState } from "react";
import App, { AppContext, AppInitialProps } from "next/app";
import router from "next/router";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import withRedux from "next-redux-wrapper";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "react-toast-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalStyles, GlobalFonts } from "@Components/Theme/GlobalStyles";
import {
  blackWhite,
  whiteBlack,
  yellowBlue,
  yellowBlack,
  greenWhite,
  redWhite,
  fontA,
} from "@Components/Theme/Theme";
// #endregion Global Imports

// #region Local Imports
import { theme } from "@Definitions/Styled";
import { AppWithStore, IStore } from "@Interfaces";
import { makeStore } from "@Redux";
import { logPageview } from "@Services/monitoring/GoogleAnalytics";
import "@Static/css/main.scss";
import { threadId } from "worker_threads";
// #endregion Local Imports

class WebApp extends App<AppWithStore> {
  static async getInitialProps({
    Component,
    ctx,
  }: AppContext): Promise<AppInitialProps> {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  userId: string = "";
  handleRouteChange = (url: any) => {
    logPageview(this.userId, url);
  };
  componentDidMount() {
    router.events.on("routeChangeComplete", this.handleRouteChange);
  }

  componentWillUnmount() {
    router.events.off("routeChangeComplete", this.handleRouteChange);
  }

  render() {
    const { Component, pageProps, store } = this.props;
    this.userId = store.getState().auth.user.id;
    const persistor = persistStore(store);
    console.log("HErere", store.getState().auth.user);

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          {/* <ThemeProvider theme={fontA}> */}
          <ThemeProvider theme={{ ...yellowBlack, ...fontA }}>
            <GlobalFonts />
            <GlobalStyles />
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </ThemeProvider>
          {/* </ThemeProvider> */}
        </PersistGate>
      </Provider>
    );
  }
}
export default withRedux(makeStore)(WebApp);
