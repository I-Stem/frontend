// #region Global Imports
import "styled-components";
// #endregion Global Imports

declare module "styled-components" {
  export interface DefaultTheme {
    colors?: {
      primary: string;
    };
    body?: string;
    text?: string;
    toggleBorder?: string;
    background?: string;
    cards?: string;
    header?: string;
    semibold?: string;
    borderColor?: string;
    font0?: string;
    font1?: string;
    font2?: string;
    font3?: string;
    font4?: string;
  }
}
