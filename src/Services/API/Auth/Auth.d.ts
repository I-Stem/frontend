// #region Interface Imports
import { IAuthPayload, IAuthResponse } from "@Interfaces";
// #endregion Interface Imports

declare namespace AuthModel {
  export interface GetApodPayload {
    params: IAuthPayload;
  }

  export interface GetApodResponse extends IAuthResponse {}
}

export { AuthModel };
