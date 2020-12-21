import Cookie from "js-cookie";
import jwtDecode from "jwt-decode";

export const TOKEN_STORAGE_KEY = "lip.authToken";

export type DecodedToken = {
  readonly email: string;
  readonly exp: number;
};

export class AuthToken {
  static async authorizationString() {
    return `Bearer ${Cookie.remove(TOKEN_STORAGE_KEY)}`;
  }

  // static async storeToken(token: string) {
  //   if (token) {
  //     const expiryEpoch = jwtDecode(token).exp * 1000;
  //     const now = new Date();

  //     Cookie.set(TOKEN_STORAGE_KEY, token, {
  //       expires: (expiryEpoch - now) / (1000 * 60 * 60 * 24),
  //     });
  //   }
  // }

  static async storeToken(token: string) {
    if (token) {
      const expiryEpoch: number = (jwtDecode(token) as DecodedToken).exp * 1000;
      const now = new Date();

      Cookie.set(TOKEN_STORAGE_KEY, token, {
        expires: (expiryEpoch - now.getTime()) / (1000 * 60 * 60 * 24),
      });
    }
  }
  static async storeUserType(userType: any) {
    const now = new Date();
    Cookie.set('userType', userType)
  }
  static async clearToken() {
    Cookie.remove(TOKEN_STORAGE_KEY);
  }
}
