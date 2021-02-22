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

  updateRole: async (
    email: string,
    payload: { id: string; action: string }
  ): Promise<any> => {
    return Http.post(`/service/email/${email}`, undefined, payload);
  },
};
