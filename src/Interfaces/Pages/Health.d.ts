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
