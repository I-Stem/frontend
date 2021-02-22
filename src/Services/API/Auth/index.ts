// #region Local Imports
import { Http } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {
  AuthForgotModel,
  AuthModel,
  AuthResetModel,
  AuthVerifyModel,
  IAuthUser,
} from "@Interfaces";
// #endregion Interface Imports

export const AuthService = {
  register: async (
    payload: AuthModel.GetApodPayload
  ): Promise<AuthModel.GetApodResponse> => {
    return Http.post<AuthModel.GetApodResponse>(
      "/auth/register",
      undefined,
      payload.params
    );
  },

  login: async (
    payload: AuthModel.GetApodPayload
  ): Promise<AuthModel.GetApodResponse> => {
    return Http.post<AuthModel.GetApodResponse>(
      "/auth/login",
      undefined,
      payload.params
    );
  },

  forgot: async (
    payload: AuthForgotModel.GetApodPayload
  ): Promise<AuthForgotModel.GetApodResponse> => {
    return Http.post<AuthForgotModel.GetApodResponse>(
      "/auth/forgot",
      undefined,
      payload.params
    );
  },

  resetPassword: async (
    payload: AuthResetModel.GetApodPayload
  ): Promise<AuthResetModel.GetApodResponse> => {
    return Http.post<AuthResetModel.GetApodResponse>(
      "/auth/reset",
      undefined,
      payload.params
    );
  },

  verifyToken: async (
    payload: AuthVerifyModel.GetApodPayload
  ): Promise<AuthVerifyModel.GetApodResponse> => {
    return Http.post<AuthVerifyModel.GetApodResponse>(
      "/auth/verify",
      undefined,
      payload.params
    );
  },
};
