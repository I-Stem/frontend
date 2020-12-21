export interface IAuthPayload {
  [key: string]: string | number;
  fullname?: string;
  email: string;
  password: string;
  userType?: number;
  organisationName?: string;
  organisationAddress?: string;
  noStudentsWithDisability?: string;
  verificationLink?: string;
}
