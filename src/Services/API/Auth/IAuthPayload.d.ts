import { UserType } from "@Definitions/Constants";

export interface IAuthPayload {
  [key: string]: string | number;
  fullname?: string;
  email: string;
  password: string;
  userType?: UserType;
  organisationName?: string;
  organisationAddress?: string;
  noStudentsWithDisability?: string;
  verificationLink?: string;
  verifyToken?: string;
}
