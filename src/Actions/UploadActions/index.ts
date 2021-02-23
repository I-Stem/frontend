/* eslint-disable no-underscore-dangle */
import { Dispatch } from "redux";

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { UploadService } from "@Services";
import { IUploadPayload } from "@Services/API/Upload/IUploadPayload";
import { IStore, UploadModel } from "@Interfaces";
import { AfcServiceActions } from "../AfcServiceActions";
import { VcServiceActions } from "../VcServiceActions";

// #endregion Local Imports

let cancelExecutor: Function;

export const UploadActions = {
  Reset: () => ({
    type: ActionConsts.Upload.ResetReducer,
  }),
  resetUploadList: () => ({
    type: ActionConsts.Upload.RESET_UPLOAD_LIST,
  }),
  cancelUploadAndRemove: (payload: IUploadPayload): any => (
    dispatch: Dispatch
  ) => {
    if (cancelExecutor) {
      cancelExecutor();
    }
    dispatch({
      payload,
      type: ActionConsts.Upload.CANCEL_UPLOAD,
    });
  },

  initiateUploading: (payload: IUploadPayload): any => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.Upload.INITIATE_UPLOADING,
    });
  },

  uploadFile: (payload: IUploadPayload): any => (
    dispatch: any,
    getState: () => IStore
  ) => {
    function progressCallback(progressEvent: ProgressEvent) {
      const progress: number =
        Number((progressEvent.loaded / progressEvent.total).toFixed(2)) * 100;

      return dispatch({
        payload: { ...payload, progress },
        type: ActionConsts.Upload.UPDATE_PROGRESS,
      });
    }

    function cancelCallback(c: Function) {
      cancelExecutor = c;
    }

    return UploadService.initiateUpload(
      payload,
      progressCallback,
      cancelCallback
    ).then((response: UploadModel.PostApodResponse) => {
      dispatch({
        payload: {
          ...payload,
          progress: 100,
          inputFileId: response.data._id,
          inputFileLink: response.data.inputURL,
        },
        type: ActionConsts.Upload.UPDATE_PROGRESS,
      });
      if (payload.type === "customModel") {
        dispatch({
          payload: { dataFileId: response.data._id },
          type: ActionConsts.VC.UPDATE_VC_DATA_FILE_ID,
        });
      }
      if (payload.type === "community") {
        dispatch({
          payload: { inputFileId: response.data._id },
          type: ActionConsts.Community.UPDATE_COM_FILE_ID,
        });
      }
      if (payload.type === "escalation") {
        dispatch({
          payload: {
            inputFileId: response.data._id,
            inputFileLink: response.data.inputURL,
          },
          type: ActionConsts.Escalation.REMEDIATE_ESCALATION,
        });
      }
      if (payload.type === "afcService") {
        dispatch({
          payload: {
            inputFileId: response.data._id,
            inputFileLink: response.data.inputURL,
          },
          type: ActionConsts.Afc.UPDATE_AFC_FILE_ID,
        });
        const { afcService } = getState();
        if (afcService._id) {
          dispatch(
            AfcServiceActions.UpdateAfcService(afcService._id.toString(), {
              ...afcService,
              status: 1,
            })
          );
        }
      }
      if (payload.type === "vcService") {
        dispatch({
          payload: {
            inputFileId: response.data._id,
            inputFileLink: response.data.inputURL,
          },
          type: ActionConsts.VC.UPDATE_VC_FILE_ID,
        });
        const { vcService } = getState();
        if (vcService._id) {
          dispatch(
            VcServiceActions.UpdateVCService(vcService._id.toString(), {
              ...vcService,
              status: 1,
            })
          );
        }
      }
    });
  },
};
