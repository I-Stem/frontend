/**
 * These are the interfaces related to ForgotPassword and Reset Password
 *Currently both have same structure but making two for future proofing.
 */

export interface IAuthForgotPasswordResponse {
  flag: string;
  message: string;
  code: number;
  error: boolean;
}

export interface IAuthResetPasswordResponse {
  flag: string;
  message: string;
  code: number;
  error: boolean;
}
