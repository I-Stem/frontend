// #region Global Imports
// #endregion Global Imports

export declare module ICommunityService {
  export interface InitialProps {}

  export interface IStateProps {
    inputFileId: string;
  }

  module Actions {
    export interface IMapPayload {
      inputFileId: string;
    }
    export interface IMapResponse {}
  }
}
