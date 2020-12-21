// #region Global Imports
import { Dispatch } from "redux";
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { CreditsService } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {FeedbackData, IStore} from "@Interfaces"
// #endregion Interface Imports

export const CreditsActions = {
  GetCredits: () => (dispatch: Dispatch) => {
    return CreditsService.getCredits()
      .then(result => {
        if (!result.error) {
          dispatch({
            payload: {
              totalCredits: result.data?.totalCredits,
              ...result,
            },
            type: ActionConsts.Credits.SetCredits,
          });
        }
        return result;
      })
      .catch(e => {
        dispatch({
          payload: { ...e },
          type: ActionConsts.Credits.ClearCredits,
        });
        return { ...e, error: true };
      });
  },
  GetCreditsHistory: () => () => {
    return CreditsService.getCreditsHistory()
      .then(result => {
        if (!result.error) {
          return result.data;
        }
        return { ...result, error: true };
      })
      .catch(e => {
        return { ...e, error: true };
      });
  },
  GetFeedbackFlags: () => () => {
    return CreditsService.getFeedbackFlags()
      .then(result => {
        if (!result.error) {
          return result.data;
        }
        return { ...result, error: true };
      })
      .catch(e => {
        return { ...e, error: true };
      });
  },
  updateCredits: (cost: object) => (dispatch: Dispatch) => {
    dispatch({
      payload: cost,
      type: ActionConsts.Credits.UpdateCredits,
    });
    return true;
  },
};
