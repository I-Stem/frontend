// #region Local Imports
import { IAction, IUpload } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { AfcReducer } from "./index";
// #endregion Local Imports

describe("AFC reducer", () => {
  it("should return the initial state", () => {
    expect(AfcReducer(undefined, {} as IAction<IUpload.IStateProps>)).toEqual({
      inputFileId: "",
      documentName: "",
      outputFormat: 0,
      tagId: "",
      inputFileLink: "",
    });
  });
});
