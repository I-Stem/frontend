import { ActionConsts } from "@Definitions";
import { AdminRequestCount } from "@Interfaces";
import { Dispatch } from "redux";

interface RequestCount {
  requestCount: AdminRequestCount;
}

interface ReviewCount {
  reviewCount: AdminRequestCount;
}

export const AdminActions = {
  UpdateRequestCount: (payload: RequestCount) => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.Admin.SAVE_REQUEST_COUNT,
    });
  },

  UpdateReviewCount: (payload: ReviewCount) => (dispatch: Dispatch) => {
    dispatch({
      payload,
      type: ActionConsts.Admin.SAVE_REVIEW_COUNT,
    });
  },
};
