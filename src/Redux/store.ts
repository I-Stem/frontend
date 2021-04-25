// #region Global Imports
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// eslint-disable-next-line import/no-extraneous-dependencies
// import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
// #endregion Global Imports

// #region Local Imports
import Reducers from "./Reducers";
// #endregion Local Imports

let store: any = undefined;
export const makeStore = (initialState: {}) => {
  // if(store !== undefined) {
  //   console.log("returning already created store instance")
  //   return store
  // }
  const persistConfig = {
    key: "root",
    storage,
  };
  store = createStore(
    persistReducer<any>(persistConfig, Reducers),
    initialState,
    compose(applyMiddleware(thunkMiddleware))
  );
  return store;
};
