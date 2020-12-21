export interface ICaptioningServicePayload {
  [key: string]: string;
  searchString: string;
}
export interface ICaptioningServicePayloadPost {
  [key: string]: string | number;
  requestType: string;
  documentName: string;
  tag: string;
  inputFileId: string;
  status?: number;
  modelId: string;
  outputFormat: string;
}

export interface ICaptioningServiceReview {
  rating: number;
  text: string;
}

export interface ICaptioningServicePatchPayload {
  [key: string]: string | number;
  inputFileId?: string;
  review?: ICaptioningServiceReview;
  status?: number;
}
export interface ICaptioningServiceTrainingModelPost {
  name: string;
  dataFileId: string;
}
