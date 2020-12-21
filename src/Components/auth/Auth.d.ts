import {
  IAuthForgotPasswordPayload,
  IAuthPayload,
  IAuthResetPasswordPayload,
  IAuthVerifyPayload,
} from "@Interfaces";
import {
  userType,
} from "@Definitions/Constants";

declare namespace IAuth {
  export interface IRegisterUserProps {
    user?: IAuthUser;
    userType: userType;
    register(params: IAuthPayload);
    saveBusinessCredentials(params: IAuthPayload): void;
  }
  export interface ILoginProps {
    message?: string;
    login(params: IAuthPayload);
    clearAuthMessage();
    verifyToken(params: IAuthVerifyPayload);
  }

  export interface IUserDropdownProps {
    user?: IAuthUser;
    token: string;
    logout();
  }

  export interface IForgotPasswordProps {
    message?: string;
    forgot(params: IAuthForgotPasswordPayload);
    clearAuthMessage();
  }
  export interface IResetPasswordProps {
    resetPassword(params: IAuthResetPasswordPayload);
  }
  export interface IAuthDisclaimerProps {
    message?: string;
  }
}

export { IAuth };
