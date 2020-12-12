// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IAfcService } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IAfcService.IStateProps = {
  inputFileId: "",
  documentName: "",
  outputFormat: 0,
  tagId: "",
  inputFileLink: "",
};

type IMapPayload = IAfcService.Actions.IMapPayload;

export const AfcReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Afc.SAVE_AFC_SERVICE:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId || state.inputFileId,
        inputFileLink: action.payload?.inputFileLink || state.inputFileLink,
        ...action.payload,
      };

    case ActionConsts.Afc.RESET_AFC_SERVICE:
      return INITIAL_STATE;

    case ActionConsts.Afc.UPDATE_AFC_FILE_ID:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId,
        inputFileLink: action.payload?.inputFileLink || state.inputFileLink,
      };

    default:
      return state;
  }
};
