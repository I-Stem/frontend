import {
  IAuthForgotPasswordPayload,
  IAuthPayload,
  IAuthResetPasswordPayload,
  IAuthVerifyPayload,
} from "@Interfaces";
import { UserType } from "@Definitions/Constants";

declare namespace IAuth {
  export interface IRegisterUserProps {
    user?: IAuthUser;
    userType: UserType;
    register(params: IAuthPayload);
    saveBusinessCredentials(params: IAuthPayload);
    email?: any;
    verificationToken?: any;
    organisation?: any;
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
