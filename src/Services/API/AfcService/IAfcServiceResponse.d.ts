import { AFCRequestOutputFormat } from "@Definitions/Constants/dashboard-form-constants";

export interface IAfcServiceTag {
  _id: String;
  name: String;
}

interface IAfcServiceReviewResponse {
  _id: string;
  createdAt: Date;
  rating: number;
  text: string;
  id: string;
}

export interface IAfcServiceDocument {
  _id?: string;
  id: string;
  userId: string;
  documentName: string;
  pageCount: number;
  tag: string;
  statusLog?: [];
  status: number;
  confidenceScore: number;
  createdAt: Date;
  inputFileId: string;
  updatedAt: Date;
  inputFileLink?: string;
  outputFormat: AFCRequestOutputFormat;
  outputURL?: string;
  review: IAfcServiceReviewResponse;
  docType: string;
  __v: number;
}

export interface IAfcServiceResponse {
  flag: string;
  message: string;
  data?: [IAfcServiceDocument];
  code: number;
}
