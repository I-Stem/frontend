import { ActionConsts } from "@Definitions";
import { Actions, IAdmin } from "@Interfaces/Admin";
import { IAction } from "@Interfaces";

const INITIAL_STATE: IAdmin = {
  requestCount: {
    totalAutoDomainRequests: 0,
    totalOrganizationRequests: 0,
    totalServiceRequests: 0,
  },
  reviewCount: {
    totalAutoDomainRequests: 0,
    totalOrganizationRequests: 0,
    totalServiceRequests: 0,
  },
};

type IMapPayload = Actions.IMapPayLoad;

export const AdminReducer = (
  state = INITIAL_STATE,
  action: IAction<IMapPayload>
) => {
  switch (action.type) {
    case ActionConsts.Admin.SAVE_REQUEST_COUNT:
      return {
        ...state,
        requestCount: action.payload?.requestCount,
      };
    case ActionConsts.Admin.SAVE_REVIEW_COUNT:
      return {
        ...state,
        reviewCount: action.payload?.reviewCount,
      };
    default:
      return state;
  }
};
