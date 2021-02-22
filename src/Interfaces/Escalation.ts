// #region Global Imports
import { WithTranslation } from "next-i18next";
// #endregion Global Imports

export namespace IEscalations {
  export interface IProps extends WithTranslation {}

  export interface InitialProps {
    namespacesRequired: string[];
  }

  export interface IStateProps {
    inputFileId: string;
    inputFileLink: string;
  }

  export module Actions {
    export interface IMapPayload {
      inputFileId: string;
      inputFileLink: string;
    }
    export interface IMapResponse {}
  }
}
