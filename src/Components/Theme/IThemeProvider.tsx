import { IAuthUser, IStore } from "@Interfaces";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import {
  blackWhite,
  whiteBlack,
  yellowBlue,
  yellowBlack,
  greenWhite,
  redWhite,
  fontL,
  fontM,
  fontXL,
} from "@Components/Theme/Theme";

const IThemeProvider: React.FunctionComponent<IThemeProps> = props => {
  const { children, user } = props;
  const [colorTheme, setColorTheme] = useState(blackWhite);
  const [fontTheme, setFontTheme] = useState(fontM);

  useEffect(() => {
    switch (user?.userPreferences?.themes?.colorTheme) {
      case "blackWhite":
        setColorTheme(blackWhite);
        break;
      case "whiteBlack":
        setColorTheme(whiteBlack);
        break;
      case "greenWhite":
        setColorTheme(greenWhite);
        break;
      case "redWhite":
        setColorTheme(redWhite);
        break;
      case "yellowBlack":
        setColorTheme(yellowBlack);
        break;
      case "yellowBlue":
        setColorTheme(yellowBlue);
        break;
      default:
        setColorTheme(blackWhite);
    }
    switch (user?.userPreferences?.themes?.fontTheme) {
      case "fontM":
        setFontTheme(fontM);
        break;
      case "fontL":
        setFontTheme(fontL);
        break;
      case "fontXL":
        setFontTheme(fontXL);
        break;
      default:
        setFontTheme(fontM);
    }
  }, [user?.userPreferences?.themes]);
  console.log(
    "Themeses",
    fontTheme,
    colorTheme,
    user?.userPreferences?.themes?.colorTheme,
    user?.userPreferences?.themes?.fontTheme
  );
  return (
    <ThemeProvider theme={{ ...(colorTheme || {}), ...(fontTheme || {}) }}>
      {children}
    </ThemeProvider>
  );
};
const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};
export default connect(mapStateToProps, null)(IThemeProvider);
export interface IThemeProps {
  user?: IAuthUser;
  children: JSX.Element;
}
