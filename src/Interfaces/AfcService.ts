// #region Global Imports
// #endregion Global Imports

export declare module IAfcService {
  export interface InitialProps {}

  export interface IStateProps {
    [key: string]: string | number;
    documentName: string;
    tagId: string;
    outputFormat: number;
    inputFileId: string;
    inputFileLink: string;
  }

  module Actions {
    export interface IMapPayload {
      inputFileId: string;
      inputFileLink: string;
    }
    export interface IMapResponse {}
  }
}
