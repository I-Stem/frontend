interface ICaptioningServiceReviewResponse {
  _id: string;
  createdAt: Date;
  rating: number;
  text: string;
  id: string;
}
export interface ICaptioningServiceTag {
  _id: String;
  name: String;
}
export interface ICaptioningServiceDocument {
  _id?: string;
  id: string;
  userId: string;
  documentName: string;
  tag: string;
  statusLog?: [];
  status: number;
  videoLength: number;
  inputFileId: string;
  customModelName?:string;
  confidenceScore: number;
  createdAt: Date;
  updatedAt: Date;
  inputField: string;
  outputFormat: number;
  outputURL?: string;
  review: ICaptioningServiceReviewResponse;
  __v: number;
}

export interface ICaptioningServiceResponse {
  flag: string;
  message: string;
  data?: [ICaptioningServiceDocument];
  code: number;
}

export interface IVCModels {
  modelId: string;
  name: string;
} 

export interface IVCModelsResponse {
  flag: string;
  message: string;
  data?: IVCModels[];
  code: number;
  error?: string;  
}
