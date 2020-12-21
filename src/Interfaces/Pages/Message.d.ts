// #region Global Imports
import { WithTranslation } from "next-i18next";
// #endregion Global Imports

export declare module IMessage {
  export interface IProps extends WithTranslation {}

  export interface IMessageStateProps {
    message: string;
  }

  export interface IMessagePayload {
    [key: string]: any;
    message: string;
  }

  export interface InitialProps {
    namespacesRequired: string[];
  }
}
