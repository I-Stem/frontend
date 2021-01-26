export interface EscalationsData {
  resolverName: string;
  documentName: string;
  escalationId: string;
  escaltionDate: string;
  escalationForService: string;
  pageRanges: string[];
  videoPortions: string[];
  sourceFileUrl: string;
}

export interface EscalationResponse {
  flag: string;
  message: string;
  data?: EscalationsData[];
  code: number;
  error?: string;
}
export interface EscalationDetailsParams {
  params: {
    id: string;
  };
}
export interface EscalationDetails {
  aiServiceConvertedFileURL: string;
  pageRanges: string[];
  videoPortions: string[];
  resolverId: string;
  documentName: string;
  sourceFileUrl: string;
  escalationForService: string;
  escalationId: string;
}
