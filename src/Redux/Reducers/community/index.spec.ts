// #region Local Imports
import { IAction, IUpload } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { CommunityReducer } from "./index";
// #endregion Local Imports

describe("Community Reducer", () => {
  it("should return the initial state", () => {
    const INITIAL_STATE = {
      inputFileId: "",
    };
    expect(
      CommunityReducer(undefined, {} as IAction<IUpload.IStateProps>)
    ).toEqual(INITIAL_STATE);
  });
});
