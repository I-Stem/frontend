// #region Global Imports
import { WithTranslation } from "next-i18next";
// #endregion Global Imports

declare namespace IHealthPage {
  export interface IProps {}

  export interface InitialProps {
    namespacesRequired: string[];
  }

  export interface IStateProps {
    health: {
      version: number;
    };
    image: {
      url: string;
    };
  }
}

export { IHealthPage };
