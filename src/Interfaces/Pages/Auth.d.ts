// #region Global Imports
import { WithTranslation } from "next-i18next";
import { IAuthUser } from "@Services/API/Auth/IAuthResponse";
// #endregion Global Imports

declare module IAuth {
  export interface IProps extends WithTranslation {}

  export interface IAuthStateProps {
    user: IAuthUser;
    token: string;
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
