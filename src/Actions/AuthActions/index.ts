// #region Global Imports
import { Dispatch } from "redux";
import storage from "redux-persist/lib/storage";
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { AuthService, AuthToken } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {
  IAuthForgotPasswordPayload,
  IAuthPayload,
  IAuthResetPasswordPayload,
  IAuthUser,
  IAuthVerifyPayload,
} from "@Interfaces";
// #endregion Interface Imports

export const AuthActions = {
  // Map: (payload: {}) => ({
  //   payload,
  //   type: ActionConsts.Auth.SetReducer,
  // }),

  // Reset: () => ({
  //   type: ActionConsts.Auth.ResetReducer,
  // }),

  Register: (payload: IAuthPayload) => (dispatch: Dispatch) => {
    return AuthService.register({
      params: payload,
    })
      .then(result => {
        if (!result.error) {
          dispatch({
            payload: { user: payload, ...result },
            type: ActionConsts.Auth.REGISTER_SUCCESS,
          });
        } else {
          dispatch({
            payload: { ...result },
            type: ActionConsts.Auth.REGISTER_FAIL,
          });
        }
        return result;
      })
      .catch(e => {
        // TODO: capture sentry exception
        dispatch({
          payload: { ...payload, ...e },
          type: ActionConsts.Auth.REGISTER_FAIL,
        });
        return { ...e, error: true };
      });
  },

  User: (payload: IAuthUser): any => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.Auth.LOGIN_SUCCESS,
    });
  },

  Login: (payload: IAuthPayload) => async (dispatch: Dispatch) => {
    return AuthService.login({
      params: payload,
    })
      .then(result => {
        if (!result.error) {
          AuthToken.storeToken(result.data.token);
          AuthToken.storeUserType(result.data.user.userType);
          dispatch({
            payload: { ...payload, ...result.data },
            type: ActionConsts.Auth.LOGIN_SUCCESS,
          });
        } else {
          dispatch({
            payload: { ...result },
            type: ActionConsts.Auth.LOGIN_FAIL,
          });
        }
        return result;
      })
      .catch(e => {
        // TODO: capture sentry exception
        dispatch({
          payload: { ...payload, ...e },
          type: ActionConsts.Auth.LOGIN_FAIL,
        });
        return { ...e, error: true };
      });
  },
  Forgot: (payload: IAuthForgotPasswordPayload) => async (
    dispatch: Dispatch
  ) => {
    return AuthService.forgot({
      params: payload,
    })
      .then(result => {
        if (!result.error) {
          dispatch({
            payload: { ...result },
            type: ActionConsts.Auth.FORGOT_PASSWORD_SUCCESS,
          });
        } else {
          dispatch({
            payload: { ...result },
            type: ActionConsts.Auth.FORGOT_PASSWORD_FAIL,
          });
        }
        return result;
      })
      .catch(e => {
        // TODO: capture sentry exception
        dispatch({
          payload: { ...e },
          type: ActionConsts.Auth.FORGOT_PASSWORD_FAIL,
        });
        return { ...e, error: true };
      });
  },
  ResetPassword: (payload: IAuthResetPasswordPayload) => async () => {
    return AuthService.resetPassword({
      params: payload,
    });
  },
  SaveBusinessCredentials: (user: IAuthPayload) => async (
    dispatch: Dispatch
  ) => {
    dispatch({
      payload: { user },
      type: ActionConsts.Auth.SetReducer,
    });
  },
  Logout: () => (dispatch: Dispatch) => {
    AuthToken.clearToken();
    storage.removeItem("persist:root");
    dispatch({ type: ActionConsts.Auth.ResetReducer });
  },
  ClearAuthMessage: () => (dispatch: Dispatch) => {
    dispatch({
      type: ActionConsts.Auth.CLEAR_TOAST_REQUEST,
    });
  },
  VerifyToken: (payload: IAuthVerifyPayload) => async () => {
    return AuthService.verifyToken({
      params: payload,
    });
  },
  updateCardPreferences: (user: IAuthPayload) => async (dispatch: Dispatch) => {
    dispatch({
      payload: { ...user },
      type: ActionConsts.Auth.SetReducer,
    });
  },
};
