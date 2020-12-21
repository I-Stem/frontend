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
  inputField: string;
  outputFormat: number;
  outputURL?: string;
  review: IAfcServiceReviewResponse;
  __v: number;
}

export interface IAfcServiceResponse {
  flag: string;
  message: string;
  data?: [IAfcServiceDocument];
  code: number;
}
