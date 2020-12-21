export interface IAuthVerifyPayload {
  [key: string]: string;
  email: string;
  verifyUserToken: string;
}
