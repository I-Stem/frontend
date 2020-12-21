// #region Global Imports
import React from "react";
import App, { AppContext, AppInitialProps } from "next/app";
import router from "next/router";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import withRedux from "next-redux-wrapper";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "react-toast-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
// #endregion Global Imports

// #region Local Imports
import { theme } from "@Definitions/Styled";
import { AppWithStore } from "@Interfaces";
import { makeStore } from "@Redux";
import { logPageview } from "@Services/monitoring/GoogleAnalytics";
import "@Static/css/main.scss";
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

  handleRouteChange = (url: any) => {
    logPageview(url);
  };
  componentDidMount() {
    router.events.on("routeChangeComplete", this.handleRouteChange);
  }

  componentWillUnmount() {
    router.events.off("routeChangeComplete", this.handleRouteChange);
  }

  render() {
    const { Component, pageProps, store } = this.props;

    const persistor = persistStore(store);

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={theme}>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(WebApp);
