// #region Global Imports
import { Dispatch } from "redux";
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { CommunityService } from "@Services";
// #endregion Local Imports
import { IStore } from "@Redux/IStore";

export const BusinessActions = {
  GetDisabilities: () => () => {
    return CommunityService.getDisabilitiesData();
  },
};
