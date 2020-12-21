// #region Global Imports
// #endregion Global Imports

export declare module IVCService {
  export interface InitialProps {}

  export interface IStateProps {
    [key: string]: string | number;
    documentName: string;
    tagId: string;
    inputFileId: string;
    dataFileId: string;
  }

  module Actions {
    export interface IMapPayload {
      inputFileId: string;
      dataFileId: string;
    }
    export interface IMapResponse {}
  }
}
