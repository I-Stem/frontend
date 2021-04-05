// #region Local Imports
import { IAction, IAuthSuccess } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { AuthReducer } from "./index";
import { UserType } from "@Definitions/Constants";
// #endregion Local Imports
const INITIAL_STATE = {
  user: {
    fullname: "",
    email: "",
    password: "",
    userType: UserType.I_STEM,
  },
  token: "",
  organizationStatus: "",
};

describe("Auth reducer", () => {
  it("should return the initial state", () => {
    expect(AuthReducer(undefined, {} as IAction<IAuthSuccess>)).toEqual(
      INITIAL_STATE
    );
  });

  it("should handle SetReducer", () => {
    expect(
      AuthReducer(INITIAL_STATE, {
        type: ActionConsts.Auth.SetReducer,
        payload: {
          name: "John Snow",
        },
      })
    ).toEqual({
      ...INITIAL_STATE,
      name: "John Snow",
    });
  });
});
