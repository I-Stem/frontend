// #region Local Imports
import { IAction, IAuthSuccess } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { AuthReducer } from ".";
// #endregion Local Imports

describe("home reducer", () => {
  it("should return the initial state", () => {
    expect(AuthReducer(undefined, {} as IAction<IAuthSuccess>)).toEqual({
      home: {
        version: 1,
      },
      image: {
        url: "",
      },
    });
  });

  it("should handle SetReducer", () => {
    expect(
      AuthReducer([], {
        type: ActionConsts.Home.SetReducer,
        payload: {
          name: "",
        },
      })
    ).toEqual({
      name: "",
    });
  });
});
