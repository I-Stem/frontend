// #region Interface Imports
import { IAction, IMessage } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IMessage.IMessageStateProps = {
  message: "",
};

type IMapPayload = IMessage.IMessagePayload;

export const MessageReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  const { type, payload = { message: "" } } = action;
  const matches = /(.*)_(REQUEST|FAIL|SUCCESS)/.exec(type);
  // not a *_REQUEST / *_FAIL / *_SUCCESS actions, so we ignore them
  if (!matches) return state;
  const [, requestName, requestState] = matches;
  if ((payload && payload.message) || requestName === "CLEAR_TOAST") {
    return {
      ...state,
      // Store errorMessage
      // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
      //      else clear errorMessage when receiving GET_TODOS_REQUEST
      [requestName]:
        requestState === "FAIL" || requestState === "SUCCESS"
          ? payload.message
          : "",
      message:
        requestState === "FAIL" || requestState === "SUCCESS"
          ? payload.message
          : "",
    };
  }
  return {
    ...state,
  };
};
