// #region Local Imports
import { ActionConsts } from "@Definitions";
// #endregion Local Imports

// #region Interface Imports
import { IAction, IUniversity } from "@Interfaces";
// #endregion Interface Imports

const INITIAL_STATE: IUniversity.IStateProps = {
  csvFile: [],
  csvErrors: [],
};

type IMapPayload = IUniversity.Actions.IMapPayLoad;

export const UniversityReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.University.UPLOAD_CSV:
      return {
        ...state,
        csvFile: action.payload?.csvFile,
      };
    case ActionConsts.University.CSV_ERRORS:
      return {
        ...state,
        csvErrors: action.payload?.csvErrors,
      };
    default:
      return state;
  }
};
