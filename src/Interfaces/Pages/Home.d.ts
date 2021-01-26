declare namespace IHomePage {
  export interface IProps {}

  export interface InitialProps {
    namespacesRequired: string[];
  }
  export interface IStateProps {
    home: {
      version: number;
    };
    image: {
      url: string;
    };
  }

  namespace Actions {
    export interface IMapPayload {}

    export interface IMapResponse {}

    export interface IGetApodPayload extends PlanetaryModel.GetApodPayload {
      params: {};
    }

    export interface IGetApodResponse extends PlanetaryModel.GetApodResponse {}
  }
}

export { IHomePage };
