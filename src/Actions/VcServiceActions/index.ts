import { Dispatch } from "redux";

import { CaptioningService, } from "@Services";

import {
  ICaptioningServicePatchPayload,
  ICaptioningServicePayload,
  ICaptioningServicePayloadPost,
  IStore,
  ICaptioningServiceTrainingModelPost
} from "@Interfaces";
import { ActionConsts } from "@Definitions";

export const VcServiceActions = {
  Search: (payload: ICaptioningServicePayload) => () => {
    return CaptioningService.search({
      params: payload,
    });
  },
  Add: (payload: ICaptioningServicePayloadPost) => async (
    dispatch: Dispatch,
    getState: () => IStore
  ) => {
    const { inputFileId } = getState().vcService;

    const params = {
      documentName: payload.documentName,
      tag: payload.tag,
      status: inputFileId ? 1 : 0,
      inputFileId,
      modelId:payload.modelId,
      requestType: payload.requestType,
      outputFormat: payload.outputFormat,
    };
    if (!inputFileId) {
      delete params.inputFileId;
    }
    return CaptioningService.add({
      documentData: params,
    });
  },

  UpdateVCService: (id: string, payload: ICaptioningServicePatchPayload) => (
    dispatch: Dispatch
  ) => {
    return CaptioningService.update(id, {
      params: payload,
    }).then(() => {
      dispatch({
        type: ActionConsts.VC,
      });
    });
  },

  ReviewVcService: (
    id: string,
    payload: ICaptioningServicePatchPayload
  ) => () => {
    return CaptioningService.review(id, {
      params: payload,
    });
  },

  EscalateVCService: (
    id: string,
    payload: ICaptioningServicePatchPayload
  ) => () => {
    return CaptioningService.escalate(id, {
      params: payload,
    });
  },

  AddModel: (payload: ICaptioningServiceTrainingModelPost) => (
    dispatch: Dispatch,
    ) => {
      console.log("Payload", payload)
      return CaptioningService.addVCModel({
          params: payload,
        });
  },

  GetVCModels: () => () => {
    return CaptioningService.getVCModels()
    .then(result => {
      if (!result.error) {
      return result.data;
    }
    return { ...result, error: true };
  })
  .catch(e => {
    return { ...e, error: true };
  });
  }
};
