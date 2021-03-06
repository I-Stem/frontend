// #region Global Imports
import { IAuthUser } from "@Services/API/Auth/IAuthResponse";
// #endregion Global Imports

declare module IAuth {
  export interface IProps {}

  export interface IAuthStateProps {
    user: IAuthUser;
    token: string;
    organizationStatus: string;
  }

  export interface InitialProps {
    namespacesRequired: string[];
  }
  namespace Actions {
    export interface IMapPayload extends IAuthSuccess {}

    export interface IMapResponse {}

    export interface IGetApodPayload extends Authmodel.GetApodResponse {
      params: {};
    }

    export interface IGetApodResponse extends Authmodel.GetApodResponse {}
  }
}

export { IAuth };
