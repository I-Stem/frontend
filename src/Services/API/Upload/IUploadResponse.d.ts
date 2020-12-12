export interface IUploadData {
  _id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  inputURL: string;
}
export interface IUploadResponse {
  flag: string;
  message: string;
  data: IUploadData;
  code: number;
}
