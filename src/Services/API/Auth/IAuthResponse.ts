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
  userPreferences?: UserPreferences;
  escalationSetting?: string;
}

export interface UserPreferences {
  cardPreferences: CardPreferences;
  darkMode?: boolean;
}
export interface CardPreferences {
  showOnboardStaffCard?: boolean;
  showOnboardStudentsCard?: boolean;
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
    contextPath?: string;
  };
  code: number;
  error: boolean;
}
