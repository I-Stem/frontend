// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IAuth, IAuthSuccess } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IAuth.IAuthStateProps = {
  user: {
    fullname: "",
    email: "",
    password: "",
    userType: 0,
  },
  token: "",
};

type IMapPayload = IAuthSuccess;

export const AuthReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Auth.SetReducer:
      return {
        ...state,
        ...action.payload,
      };
    case ActionConsts.Auth.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload?.user,
      };
    case ActionConsts.Auth.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload?.token,
        user: action.payload?.user,
      };

    case ActionConsts.Auth.ResetReducer:
      return INITIAL_STATE;

    default:
      return state;
  }
};
