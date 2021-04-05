// #region Local Imports
import { IAction, IUpload } from "@Interfaces";
import { ActionConsts } from "@Definitions";
import { VCReducer } from "./index";
// #endregion Local Imports

describe("VC reducer", () => {
  it("should return the initial state", () => {
    const INITIAL_STATE = {
      inputFileId: "",
      documentName: "",
      outputFormat: 0,
      tagId: "",
      dataFileId: "",
    };

    expect(VCReducer(undefined, {} as IAction<IUpload.IStateProps>)).toEqual(
      INITIAL_STATE
    );
  });
});
