// #region Local Imports
import { Http } from "@Services";
// #endregion Local Imports

export const AccessService = {
  requestAccess: async (): Promise<any> => {
    return Http.get("/service");
  },

  getRequestAccess: async (): Promise<any> => {
    return Http.get("/service/access");
  },
};
