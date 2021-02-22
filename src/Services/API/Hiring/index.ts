import { Http } from "@Services";
import {
  CandidatesDataResponse,
  contactCandidateParams,
  FilterParams,
  hiringActionParams,
  hiringParameters,
} from "./IHiringResponse";

export const HiringService = {
  getCandidates: async (
    query?: FilterParams,
    payload?: any
  ): Promise<CandidatesDataResponse> => {
    return Http.post(`/hiring`, query?.params, payload);
  },

  hiringAction: async (payload: hiringActionParams): Promise<any> => {
    return Http.post("/hiring/action", undefined, payload);
  },

  contactCandidate: async (payload: contactCandidateParams): Promise<any> => {
    return Http.post("/hiring/contact", undefined, payload);
  },

  getComments: async (payload: { jobId: string }): Promise<any> => {
    return Http.post("/hiring/comments", undefined, payload);
  },
};
