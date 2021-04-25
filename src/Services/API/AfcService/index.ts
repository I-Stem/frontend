// #region Local Imports
import { Http } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {
  AfcEscalateRequestModel,
  AfcServiceModel,
  AfcServicePatchModel,
} from "@Interfaces";
// #endregion Interface Imports

export const AfcService = {
  search: async (
    payload: AfcServiceModel.GetApodPayload
  ): Promise<AfcServiceModel.GetApodResponse> => {
    return Http.get<AfcServiceModel.GetApodResponse>("/afc", payload.params);
  },
  add: async (
    payload: AfcServiceModel.PostApodPayload
  ): Promise<AfcServiceModel.PostApodResponse> => {
    return Http.post("/afc", undefined, payload.params);
  },

  updateAfcService: async (
    id: string,
    payload: AfcServicePatchModel.PatchApodPayload
  ): Promise<AfcServicePatchModel.PatchApodResponse> => {
    return Http.patch(`/afc/${id}`, undefined, payload.params);
  },

  updateAfc: async (
    id: string
  ): Promise<AfcServicePatchModel.PatchApodResponse> => {
    return Http.post(`/afc/failed/${id}`, undefined);
  },

  review: async (
    id: string,
    payload: AfcServicePatchModel.PatchApodPayload
  ): Promise<AfcServicePatchModel.PatchApodResponse> => {
    return Http.patch(`/afc/${id}/review`, undefined, payload.params);
  },
  escalate: async (
    id: string,
    payload: AfcEscalateRequestModel.PatchApodPayload
  ): Promise<AfcEscalateRequestModel.PatchApodResponse> => {
    return Http.post(`/afc/${id}/escalate`, undefined, payload.params);
  },

  getAfcCount: async (payload: {
    params: { searchText: string };
  }): Promise<any> => {
    return Http.get<any>("afc/afcCount", payload.params);
  },
  getDetails: async (params: { id: string }): Promise<any> => {
    return Http.get("/afc/details", params);
  },
};
