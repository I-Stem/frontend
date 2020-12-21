export interface IAuthResetPasswordPayload {
  [key: string]: string;
  email: string;
  passwordResetToken: string;
  password: string;
}

export interface IAuthForgotPasswordPayload {
  [key: string]: string;
  email: string;
  resetPasswordURL: string;
}
