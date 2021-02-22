/* eslint-disable no-underscore-dangle */
import { Dispatch } from "redux";

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { UniversityPortal } from "@Services";
import { IUploadPayload } from "@Services/API/Upload/IUploadPayload";
import { IStore, UploadModel } from "@Interfaces";

// #endregion Local Imports

interface UploadCsvProps {
  csvFile: Array<any>;
}
interface CsvErrorsProps {
  csvErrors: Array<any>;
}

export const UniversityPortalActions = {
  UploadCsvFile: (payload: UploadCsvProps): any => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.University.UPLOAD_CSV,
    });
  },
  CsvErrors: (payload: CsvErrorsProps): any => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.University.CSV_ERRORS,
    });
  },
  ResetCsvData: (): any => (dispatch: Dispatch) => {
    dispatch({ type: ActionConsts.University.RESET_CSV_DATA });
  },
  ResetEscalation: (): any => (dispatch: Dispatch) => {
    dispatch({ type: ActionConsts.Escalation.RESET_ESCALATION });
  },
};
