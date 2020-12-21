// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IVCService } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IVCService.IStateProps = {
  inputFileId: "",
  documentName: "",
  outputFormat: 0,
  tagId: "",
  dataFileId: ""
};

type IMapPayload = IVCService.Actions.IMapPayload;

export const VCReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.VC.SAVE_VC_SERVICE:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId || state.inputFileId,
        ...action.payload,
      };

    case ActionConsts.VC.RESET_VC_SERVICE:
      return INITIAL_STATE;

    case ActionConsts.VC.UPDATE_VC_FILE_ID:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId,
      };

      case ActionConsts.VC.UPDATE_VC_DATA_FILE_ID:
        return {
          ...state,
          dataFileId: action?.payload?.dataFileId,
        };
  
    default:
      return state;
  }
};
