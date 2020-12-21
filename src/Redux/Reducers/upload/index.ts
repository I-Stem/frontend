// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IUpload } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IUpload.IStateProps = {
  isUploading: false,
  files: {},
};

type IMapPayload = IUpload.Actions.IMapPayload;

export const UploadReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Upload.ResetReducer:
      return INITIAL_STATE;

    case ActionConsts.Upload.INITIATE_UPLOADING:
      return {
        ...state,
        isUploading: true,
        files: { ...state.files, [action.payload?.type || ""]: action.payload },
      };

    case ActionConsts.Upload.UPDATE_PROGRESS:
      return {
        ...state,
        isUploading: action.payload?.progress !== 100,
        files: { ...state.files, [action.payload?.type || ""]: action.payload },
      };
    case ActionConsts.Upload.CANCEL_UPLOAD:
      return {
        ...state,
        isUploading: false,
        files: { ...state.files, [action.payload?.type || ""]: "" },
      };

    case ActionConsts.Upload.RESET_UPLOAD_LIST:
      return {
        ...state,
        files: {},
      };

    default:
      return state;
  }
};
