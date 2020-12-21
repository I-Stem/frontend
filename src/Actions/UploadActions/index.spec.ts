// #region Global Imports
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { UploadActions } from ".";
// #endregion Local Imports

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Upload action tests", () => {
  test("Map test", () => {
    const store = mockStore();

    const expectedActions = [
      {
        payload: { version: 2 },
        type: ActionConsts.Upload.SetReducer,
      },
    ];

    store.dispatch(UploadActions.Map({ version: 2 }));

    expect(store.getActions()).toEqual(expectedActions);
  });

  test("Reset test", async () => {
    const store = mockStore({
      upload: {
        version: 1,
      },
    });

    const expectedActions = [
      {
        type: ActionConsts.Upload.ResetReducer,
      },
    ];

    store.dispatch(UploadActions.Reset());

    expect(store.getActions()).toEqual(expectedActions);
  });
});
