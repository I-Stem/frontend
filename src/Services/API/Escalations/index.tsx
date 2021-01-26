import { Http } from "@Services";
import {
  EscalationDetailsParams,
  EscalationResponse,
} from "./IEscalationResponse";

export const EscalationService = {
  getEscalations: async (): Promise<EscalationResponse> => {
    return Http.get<EscalationResponse>("/escalation");
  },
  assignEscalation: async (payload: { id: string }): Promise<any> => {
    return Http.post("/escalation/assign", undefined, payload);
  },
  resolveEscalation: async (payload: any): Promise<any> => {
    return Http.post("/escalation/resolve", undefined, payload);
  },
  getEscalationDetails: async (
    params: EscalationDetailsParams
  ): Promise<any> => {
    return Http.get("/escalation/details", params.params);
  },
};
