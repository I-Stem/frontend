// #region Interface Imports
import {
  ICaptioningServicePayload,
  ICaptioningServicePayloadPost,
  ICaptioningServiceResponse,
  ICaptioningServiceTrainingModelPost,
  IVCModels,
  IVCModelsResponse,
} from "@Interfaces";
// #endregion Interface Imports

declare namespace CaptioningServiceModel {
  export interface GetApodPayload {
    params: ICaptioningServicePayload;
  }

  export interface GetApodResponse extends ICaptioningServiceResponse {}
  export interface PostApodPayload {
    documentData: ICaptioningServicePayloadPost;
  }
  export interface PostApodResponse extends ICaptioningServiceResponse {}
}

declare namespace CaptioningServicePatchModel {
  export interface PatchApodPayload {
    params: ICaptioningServicePatchPayload;
  }
  export interface PatchApodResponse extends ICaptioningServiceResponse {}
}

declare namespace VCModelsServicesModel {
  export interface VCModelsApodResponse extends IVCModelsResponse {}

  export interface PostApodPayload {
    params: ICaptioningServiceTrainingModelPost;
  }
  export interface PostApodResponse extends IVCTrainingModelResponse {}
}

export { CaptioningServiceModel, CaptioningServicePatchModel, VCModelsServicesModel };

