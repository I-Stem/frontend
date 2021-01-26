export namespace IUniversity {
  export interface InitialProps {
    namespacesRequired: string[];
  }
  export interface IStateProps {
    csvFile: Array<any>;
    csvErrors: Array<any>;
  }

  export module Actions {
    export interface IMapPayLoad {
      csvFile: Array<any>;
      csvErrors: Array<any>;
    }
  }
}
