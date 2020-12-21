import { Dispatch } from "redux";

import { AfcService } from "@Services";

import {
  IAfcServiceEscalatePayload,
  IAfcServicePatchPayload,
  IAfcServicePayload,
  IAfcServicePayloadPost,
  IStore,
} from "@Interfaces";
import { ActionConsts } from "@Definitions";

export const AfcServiceActions = {
  Search: (payload: IAfcServicePayload) => () => {
    return AfcService.search({
      params: payload,
    });
  },
  Add: (payload: IAfcServicePayloadPost) => (
    dispatch: Dispatch,
    getState: () => IStore
  ) => {
    const { inputFileId } = getState().afcService;

    const params = {
      documentName: payload.documentName,
      outputFormat: payload.outputFormat,
      tag: payload.tag,
      docType: payload.docType,
      status: inputFileId ? 1 : 0,
      inputFileId,
    };
    if (!inputFileId) {
      delete params.inputFileId;
    }

    return AfcService.add({ params }).then(result => {
      if (inputFileId) {
        dispatch({
          type: ActionConsts.Afc.RESET_AFC_SERVICE,
        });
      } else {
        dispatch({
          payload: result.data,
          type: ActionConsts.Afc.SAVE_AFC_SERVICE,
        });
      }
      return result.data;
    });
  },
  UpdateAfcService: (id: string, payload: IAfcServicePatchPayload) => (
    dispatch: Dispatch
  ) => {
    return AfcService.updateAfcService(id, {
      params: payload,
    }).then(() => {
      dispatch({
        type: ActionConsts.Afc.RESET_AFC_SERVICE,
      });
    });
  },

  ReviewAfcService: (id: string, payload: IAfcServicePatchPayload) => () => {
    return AfcService.review(id, {
      params: payload,
    });
  },

  EscalateAfcService: (
    id: string,
    payload: IAfcServiceEscalatePayload
  ) => () => {
    return AfcService.escalate(id, {
      params: payload,
    });
  },
};
