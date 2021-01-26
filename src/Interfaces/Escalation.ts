export namespace IEscalations {
  export interface IProps {}

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
