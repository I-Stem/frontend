// #region Local Imports
import { Http } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {
  CaptioningServiceModel,
  CaptioningServicePatchModel,
  VCModelsServicesModel,
} from "@Interfaces";
// #endregion Interface Imports

export const CaptioningService = {
  search: async (
    payload: CaptioningServiceModel.GetApodPayload
  ): Promise<CaptioningServiceModel.GetApodResponse> => {
    return Http.get<CaptioningServiceModel.GetApodResponse>(
      "/vc", // Change this when you Captioning Route
      payload.params
    );
  },

  add: async (
    payload: CaptioningServiceModel.PostApodPayload
  ): Promise<CaptioningServiceModel.PostApodResponse> => {
    return Http.post("/vc", undefined, payload.documentData);
  },

  update: async (
    id: string,
    payload: CaptioningServicePatchModel.PatchApodPayload
  ): Promise<CaptioningServicePatchModel.PatchApodResponse> => {
    return Http.post("/vc", undefined, payload.params);
  },

  updateVc: async (
    id: string
  ): Promise<CaptioningServicePatchModel.PatchApodResponse> => {
    return Http.post(`/vc/failed/${id}`, undefined);
  },

  review: async (
    id: string,
    payload: CaptioningServicePatchModel.PatchApodPayload
  ): Promise<CaptioningServicePatchModel.PatchApodResponse> => {
    return Http.post(`/vc/${id}/review`, undefined, payload.params);
  },

  escalate: async (
    id: string,
    payload: CaptioningServicePatchModel.PatchApodPayload
  ): Promise<CaptioningServicePatchModel.PatchApodResponse> => {
    return Http.post(`/vc/${id}/escalate`, undefined, payload.params);
  },

  getVCModels: async (): Promise<
    VCModelsServicesModel.VCModelsApodResponse
  > => {
    return await Http.get<VCModelsServicesModel.VCModelsApodResponse>(
      "/vc/model"
    );
  },

  addVCModel: async (
    payload: VCModelsServicesModel.PostApodPayload
  ): Promise<VCModelsServicesModel.PostApodPayload> => {
    return Http.post("/vc/model", undefined, payload.params);
  },

  getVcCount: async (): Promise<any> => {
    return Http.get<any>("vc/vcCount");
  },
};
