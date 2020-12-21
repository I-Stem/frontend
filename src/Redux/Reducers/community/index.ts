// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IAfcService, ICommunityService } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: ICommunityService.IStateProps = {
  inputFileId: "",
};

type IMapPayload = ICommunityService.Actions.IMapPayload;

export const CommunityReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Community.SAVE_COM_SERVICE:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId || state.inputFileId,
        ...action.payload,
      };

    case ActionConsts.Community.RESET_COM_SERVICE:
      return INITIAL_STATE;

    case ActionConsts.Community.UPDATE_COM_FILE_ID:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId,
      };

    default:
      return state;
  }
};
