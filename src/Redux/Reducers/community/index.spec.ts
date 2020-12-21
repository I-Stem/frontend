// #region Local Imports
import { IAction, IUpload } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { UploadReducer } from ".";
// #endregion Local Imports

describe("Upload reducer", () => {
  it("should return the initial state", () => {
    expect(
      UploadReducer(undefined, {} as IAction<IUpload.IStateProps>)
    ).toEqual({});
  });
});
