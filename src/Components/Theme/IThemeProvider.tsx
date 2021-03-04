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
import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";

const IThemeProvider: React.FunctionComponent<IThemeProps> = props => {
  const { children, user } = props;
  const [colorTheme, setColorTheme] = useState(blackWhite);
  const [fontTheme, setFontTheme] = useState(fontM);

  useEffect(() => {
    switch (user?.userPreferences?.themes?.colorTheme) {
      case ColorThemes.BLACKWHITE:
        setColorTheme(blackWhite);
        break;
      case ColorThemes.WHITEBLACK:
        setColorTheme(whiteBlack);
        break;
      case ColorThemes.GREENWHITE:
        setColorTheme(greenWhite);
        break;
      case ColorThemes.REDWHITE:
        setColorTheme(redWhite);
        break;
      case ColorThemes.YELLOWBLACK:
        setColorTheme(yellowBlack);
        break;
      case ColorThemes.YELLOWBLUE:
        setColorTheme(yellowBlue);
        break;
      default:
        setColorTheme(blackWhite);
    }
    switch (user?.userPreferences?.themes?.fontTheme) {
      case FontThemes.FONTM:
        setFontTheme(fontM);
        break;
      case FontThemes.FONTL:
        setFontTheme(fontL);
        break;
      case FontThemes.FONTXL:
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
