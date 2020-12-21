// #region Interface Imports
import {
  IAfcServicePatchPayload,
  IAfcServicePayload,
  IAfcServicePayloadPost,
  IAfcServiceResponse,
} from "@Interfaces";
// #endregion Interface Imports

declare namespace AfcServiceModel {
  export interface GetApodPayload {
    params: IAfcServicePayload;
  }
  export interface GetApodResponse extends IAfcServiceResponse {}
  export interface PostApodPayload {
    params: IAfcServicePayloadPost;
  }
  export interface PostApodResponse extends IAfcServiceResponse {}
}

declare namespace AfcServicePatchModel {
  export interface PatchApodPayload {
    params: IAfcServicePatchPayload;
  }
  export interface PatchApodResponse extends IAfcServiceResponse {}
}

declare namespace AfcEscalateRequestModel {
  export interface PatchApodPayload {
    params: IAfcServiceEscalatePayload;
  }
  export interface PatchApodResponse extends IAfcServiceResponse {}
}

export { AfcServiceModel, AfcServicePatchModel, AfcEscalateRequestModel };
