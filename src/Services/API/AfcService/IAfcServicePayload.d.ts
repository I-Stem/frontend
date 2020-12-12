import { AFCRequestOutputFormat } from "@Definitions/Constants/dashboard-form-constants";

export interface IAfcServicePayload {
  [key: string]: string;
  searchString: string;
}
export interface IAfcServicePayloadPost {
  [key: string]: string | number;
  documentName: string;
  tag: string;
  outputFormat: AFCRequestOutputFormat;
  inputFileId: string;
  status?: number;
  docType: string;
  inputFileLink: string;
}

export interface IAfcServiceReview {
  rating: number;
  text: string;
}

export interface IAfcServicePatchPayload {
  [key: string]: string | number;
  inputFileId?: string;
  review?: IAfcServiceReview;
  status?: number;
}

export interface IAfcServiceEscalatePayload {
  [key: string]: string;
  status: number;
  escalatedPageRange: string;
}
