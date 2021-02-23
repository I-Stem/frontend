// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IEscalations } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IEscalations.IStateProps = {
  inputFileId: "",
  inputFileLink: "",
};

type IMapPayload = IEscalations.Actions.IMapPayload;

export const EscalationReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Escalation.RESET_ESCALATION:
      return INITIAL_STATE;

    case ActionConsts.Escalation.REMEDIATE_ESCALATION:
      return {
        ...state,
        inputFileId: action?.payload?.inputFileId || state.inputFileId,
        inputFileLink: action.payload?.inputFileLink || state.inputFileLink,
        ...action.payload,
      };
    default:
      return state;
  }
};
