import { Http } from "@Services";
import { AdminResponse } from "./IAdminResponse";

export const AdminPanelServices = {
  allRequests: async (params: {
    requestType: string;
    offset: number;
  }): Promise<AdminResponse> => {
    return Http.get("/admin/fetch", params);
  },

  countPendingRequests: async (): Promise<any> => {
    return Http.get("/admin/count/pending");
  },

  countReviewedRequests: async (): Promise<any> => {
    return Http.get("/admin/count/reviewed");
  },

  requestDetails: async (params: { id: string }): Promise<any> => {
    return Http.get("/admin/request", params);
  },

  allReviewDetails: async (params: {
    requestType: string;
    offset: number;
  }): Promise<AdminResponse> => {
    return Http.get("/admin/reviews", params);
  },
};
