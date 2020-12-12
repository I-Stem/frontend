import { UserType } from "@Definitions/Constants";

export interface IAuthUser {
  role?: string;
  _id?: string;
  fullname: string;
  email: string;
  password?: string;
  userType: UserType;
  createdAt?: string;
  updatedAt?: string;
  organizationName?: string;
  organizationCode?: string;
}
export interface IAuthSuccess {
  user?: IAuthUser;
  token: string;
  token_expires_in: number;
  error?: boolean;
  message?: string;
  organizationStatus: string;
}

export interface IAuthResponse {
  flag: string;
  message: string;
  data: {
    user: IAuthUser;
    organizationStatus: string;
    token: string;
    token_expires_in: number;
  };
  code: number;
  error: boolean;
}
