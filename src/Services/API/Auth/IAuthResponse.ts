export interface IAuthUser {
  role?: string;
  _id?: string;
  fullname: string;
  email: string;
  password?: string;
  userType: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface IAuthSuccess {
  user?: IAuthUser;
  token: string;
  token_expires_in: number;
  error?: boolean;
  message?: string;
}

export interface IAuthResponse {
  flag: string;
  message: string;
  data: {
    user: IAuthUser;
    token: string;
    token_expires_in: number;
  };
  code: number;
  error: boolean;
}
