// #region Global Imports
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
// #endregion Global Imports

// #region Local Imports
import { AuthActions } from "@Actions";
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Auth action tests", () => {
  test("Map test", async () => {
    const store = mockStore();

    const expectedActions = [
      {
        payload: {
          version: 2,
        },
        type: ActionConsts.Auth.SetReducer,
      },
    ];

    store.dispatch(
      AuthActions.Map({
        version: 2,
      })
    );

    expect(store.getActions()).toEqual(expectedActions);
  });

  test("Reset test", async () => {
    const store = mockStore({
      auth: {
        version: 1,
      },
    });

    const expectedActions = [
      {
        type: ActionConsts.Auth.ResetReducer,
      },
    ];

    store.dispatch(AuthActions.Reset());

    expect(store.getActions()).toEqual(expectedActions);
  });

  test("GetApod test", async () => {
    const store = mockStore({});

    const expectedActions = [
      {
        payload: {
          image: {
            copyright: "Pankod",
            date: "2019-05-23",
            explanation: "",
            hdurl: "",
            media_type: "",
            service_version: "",
            title: "",
            url: "",
          },
        },
        type: ActionConsts.Auth.SetReducer,
      },
    ];

    // eslint-disable-next-line
    await store.dispatch<any>(AuthActions.GetApod({ params: { hd: true } }));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
