import { IAuthVerifyPayload, IAuthVerifyResponse } from "@Interfaces";
// #endregion Interface Imports

declare namespace AuthVerifyModel {
  export interface GetApodPayload {
    params: IAuthVerifyPayload;
  }

  export interface GetApodResponse extends IAuthVerifyResponse {}
}

export { AuthVerifyModel };
