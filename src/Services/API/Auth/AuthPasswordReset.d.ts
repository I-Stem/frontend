// #region Interface Imports
import {
  IAuthForgotPasswordPayload,
  IAuthForgotPasswordResponse,
  IAuthResetPasswordPayload,
  IAuthResetPasswordResponse,
} from "@Interfaces";
// #endregion Interface Imports

declare namespace AuthForgotModel {
  export interface GetApodPayload {
    params: IAuthForgotPasswordPayload;
  }

  export interface GetApodResponse extends IAuthForgotPasswordResponse {}
}

declare namespace AuthResetModel {
  export interface GetApodPayload {
    params: IAuthResetPasswordPayload;
  }

  export interface GetApodResponse extends IAuthResetPasswordResponse {}
}

export { AuthForgotModel, AuthResetModel };
