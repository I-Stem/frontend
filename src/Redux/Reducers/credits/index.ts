// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, ICredits } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: ICredits.IStateProps = {
  totalCredits: 0,
};

type IMapPayload = ICredits.Actions.IMapPayload;

export const CreditsReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Credits.SetCredits:
      return {
        ...state,
        totalCredits: action?.payload?.totalCredits,
      };
    case ActionConsts.Credits.UpdateCredits:
      return {
        ...state,
        totalCredits: state.totalCredits - (action?.payload?.cost || 0),
      };
    case ActionConsts.Credits.ClearCredits:
      return INITIAL_STATE;
    default:
      return state;
  }
};
